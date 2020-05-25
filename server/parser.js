const request = require('request-promise');
const axios = require('axios')
const cheerio = require('cheerio');
const db = require('./db')
const htmlToText = require('html-to-text');
const categorizer = require('./categorizer');
const helper = require('./helper')
const fakeUa = require('fake-useragent');

let $;


const getInitialUrl = (subs = 0) => {
  if (subs) {
    return `https://telemetr.me/channels/?participants_from=1000&participants_to=${subs}`
  }
  return `https://telemetr.me/channels/`;
}

const getUrl = (subs = 0) => {
  if (subs) {
    return `https://telemetr.me/channels/?participants_from=1000&participants_to=${subs}&mentions_week_from=1`
  }
  return `https://telemetr.me/channels/?mentions_week_from=1`
}

/**
 * @param {Cheerio} row
 * */
function parseInfo(row, parseCategories, isFirst) {
  let result = {}

  let columns = row.find('td')

  // Avatar
  let avatarRoot = columns.eq(0)
  // console.log(row)
  // TODO: need to upload images to our server
  let avatarLink = avatarRoot.find('img').first().attr('src')
  result['avatar_link'] = avatarLink

  // Name and invite link
  let nameRoot = columns.eq(1)
  let name = nameRoot.find('a').first().text()
  result['name'] = name
  if (isFirst) {
    console.log(name)
  }

  let invite_link = nameRoot.find('a').first().attr('href')
  result['last_invite_link'] = invite_link

  // Subscribers
  let subsRoot = columns.eq(2)
  let subsStr = subsRoot.find('span').first().text()
  let subsStr2 = subsRoot.find('[data-do="show_dynamic_participants"]')

  try {
    result["channel_id"] = parseInt(subsStr2.first().attr()['data-id'])
  } catch (err) {
    result["channel_id"] = null
  }
  result["subscribers"] = parseInt(subsStr.replace(/[^0-9]/g, ''))

  // Description
  let descRoot = columns.eq(9)
  let descHtml = descRoot.find('div').first().html()
  result["description"] = columns.eq(11).text().trim()

  result["categories"] = parseCategories

  return result
}

/**
 * @param {Cheerio} row
 * */
function parseCategories(row, info) {
  return row.find('a').map((index, element) => {
    return $(element).text().replace(/ *\([^)]*\) */g, '');
  }).get()
}

const writeChannelEntry = async (info) => {
  const channels = await db.collection('channels')
  const res = await channels.findOne({ name: info.name })
  if (!res) {
    channels.insert({
      channel_id: info.channel_id,
      avatar_link: info.avatar_link,
      name: info.name,
      subscribers: info.subscribers,
      description: info.description,
      last_invite_link: info.last_invite_link,
      created_at: new Date(),
      categories: info.categories
    })
  }
}

const updateChannelEntity = async (info) => {
  const channels = await db.collection('channels')
  const res = await channels.findOne({ channel_id: info.channel_id })
  if (res) {
    if (res.name !== info.name) {
      return channels.insert({
        channel_id: info.channel_id,
        avatar_link: info.avatar_link,
        name: info.name,
        subscribers: info.subscribers,
        description: info.description,
        last_invite_link: info.last_invite_link,
        created_at: new Date(),
        categories: info.categories,
        prev: res
      })
    }
    return
  }
  return channels.insert({
    channel_id: info.channel_id,
    avatar_link: info.avatar_link,
    name: info.name,
    subscribers: info.subscribers,
    description: info.description,
    last_invite_link: info.last_invite_link,
    created_at: new Date(),
    categories: info.categories
  })
}

const categorize = (data) => {
  const categories = []
  for (let key in categorizer) {
    const arrayWords = categorizer[key]
    const findInDescr = arrayWords.find(item => data.description.toLowerCase().includes(item.toLowerCase()))
    const findInName = arrayWords.find(item => data.name.toLowerCase().includes(item.toLowerCase()))
    if (findInDescr || findInName) {
      categories.push(key)
    }
  }
  return categories;
}

// $('#channels_table').find('tbody').find('tr').first().find('td')
const parseTelemetrPage = (htmlPage, isParseNew) => {
  let info;
  $ = cheerio.load(htmlPage, { decodeEntities: false })
  let columns = $('#channels_table').find('tbody').find('tr')

  for (let infoIdx = 0, categoryIndex = 1; infoIdx < columns.length; categoryIndex += 2, infoIdx += 2) {
    const data = parseInfo(columns.eq(infoIdx), parseCategories(columns.eq(categoryIndex)), infoIdx === 0)
    const categories = categorize(data)
    console.log(data)
    console.log('htmlPage!!!!!!!!!!!!!!!!!',htmlPage)
    if (data.subscribers) {
      info = data
      const totalCategories = new Set([...categories, ...data.categories])
      info.categories = [...totalCategories]
      if (isParseNew) {
        updateChannelEntity(info)
      } else {
        writeChannelEntry(info)
      }
    }
  }

  return info
}

const parseInitial = async () => {

  await db.connect()
  let subs = process.env.INITIAL_SUBS || 0

  const interval = setInterval(() => {
    const pageUrl = getInitialUrl(subs);
    // ?page=${page}&participants_from=1000
    try {
      const ua = fakeUa()
      const proxy = helper.proxyUrl()
      const req = request.get(pageUrl, {
        proxy: proxy,
        headers: {
          'User-Agent': ua,
        }
      })
        .then(html => parseTelemetrPage(html))
        .then((info) => {
          if (info.subscribers < 1100) {
            clearInterval(interval)
          }
          if (info.subscribers === subs) {
            subs = info.subscribers - 1
          } else {
            subs = info.subscribers
          }
        })
    } catch (err) {
      const errorMsg = new Error(err).stack
      console.log(errorMsg)
    }
  }, 20000)
}

const parseNew = async () => {
  await db.connect()
  let subs = process.env.INITIAL_SUBS || 0
  let check = false

  const interval = setInterval(() => {
    if (subs <= 1000) {
      if (check) {
        return clearInterval(interval);
      } else {
        check = true
      }
    }
    const pageUrl = getUrl(subs);
    // ?page=${page}&participants_from=1000
    try{
      const ua = fakeUa()
      const proxy = helper.proxyUrl()
      request.get(pageUrl, {
        proxy: proxy,
        headers: {
          'User-Agent': ua,
        }
      })
        .then(html => parseTelemetrPage(html, true))
        .then((info) => {
          if (info.subscribers < 1100) {
            clearInterval(interval)
          }
          if (info.subscribers === subs) {
            subs = info.subscribers - 1
          } else {
            subs = info.subscribers
          }
        })}catch (err) {
          const errorMsg = new Error(err).stack
          console.log(errorMsg)
        }
  }, 20000)
}

const parseCategory = async () => {
  try{const ua = fakeUa()
    const proxy = helper.proxyUrl()
    await request.get('https://telemetr.me/channels/#',{
      proxy: proxy,
        headers: {
          'User-Agent': ua,
        }
    }).then(async res => {
      const $ = cheerio.load(res);
      let data = []
      await $('.cats_long div span').each((i, elem) => {
        data.push($(elem).find('a').text())
      })
      const catCollection = await db.collection('categories')
      catCollection.replaceOne({}, { categories: data }, { upsert: true })
    })}
    catch (err) {
      const errorMsg = new Error(err).stack
      console.log(errorMsg)
    }
}

module.exports = {
  parseInitial,
  parseNew,
  parseCategory
}