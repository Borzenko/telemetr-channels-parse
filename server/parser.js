const request = require('request-promise');
const axios = require('axios')
const cheerio = require('cheerio');
const db = require('./db')
const htmlToText = require('html-to-text');
const blackList = require('./black-list');
const helper = require('./helper')
const fakeUa = require('fake-useragent');

let $;


const getInitialUrl = (subs = 0) => {
  if (subs) {
    return `https://telemetr.me/channels/?participants_from=1000&participants_to=${subs}`
  }
  return `https://telemetr.me/channels/`;
}

const getUrl = (page) => {
  return `https://telemetr.me/channels/?page=${page}&participants_from=1000&mentions_week_from=1`
}

function startInterval(seconds, callback) {
  callback();
  return setInterval(callback, seconds * 1000);
}

/**
 * @param {Cheerio} row
 * */
function parseInfo(row , parseCategories, isFirst) {
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
  if(isFirst) {
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
  let descText = htmlToText.fromString(descHtml, { wordwrap: null })
  result["description"] = descText

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

// $('#channels_table').find('tbody').find('tr').first().find('td')
const parseTelemetrPage = (htmlPage) => {
  let info;
  $ = cheerio.load(htmlPage, { decodeEntities: false })
  let columns = $('#channels_table').find('tbody').find('tr')

  for (let infoIdx = 0, categoryIndex = 1; infoIdx < columns.length; categoryIndex += 2, infoIdx += 2) {
    const data = parseInfo(columns.eq(infoIdx),parseCategories(columns.eq(categoryIndex)), infoIdx === 0)
    if (data.subscribers) {
      info = data
      writeChannelEntry(info)
    }
  }

  return info
}

const parseInitial = async () => {

  await db.connect()

  let args = process.argv.slice(2);
  let pageIdx = args.length > 0 ? args[0] : 0;
  let subs = process.env.INITIAL_SUBS || 0

  startInterval(10, () => {
    console.log(subs)
    const pageUrl = getInitialUrl(subs);
    // ?page=${page}&participants_from=1000
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
      if (info.subscribers === subs) {
        subs = info.subscribers - 1
      } else {
        subs = info.subscribers
      }
    })
    pageIdx++
  })
}

const parseNew = async () => {
  await db.connect()
  let pageIdx = 1;

  startInterval(20, () => {
    const pageUrl = getUrl(pageIdx);
    console.log("\nParsing page: " + pageIdx)
    let proxiedRequest = request.defaults({ headers: { 'User-Agent': fakeUa(), 'proxy': helper.proxyUrl() } });
    proxiedRequest(pageUrl).then(parseTelemetrPage)
    pageIdx++
  })
}

module.exports = {
  parseInitial,
  parseNew
}