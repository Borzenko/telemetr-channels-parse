const request = require('request-promise');
const cheerio = require('cheerio');
const db = require('./db')
const htmlToText = require('html-to-text');
const blackList = require('./black-list');

let $;

const getInitialUrl = (page) => {
    return `https://telemetr.me/channels/?page=${page}&participants_from=1000`;
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
function parseInfo(row) {
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

    let invite_link = nameRoot.find('a').first().attr('href')
    result['last_invite_link'] = invite_link
    
    // Subscribers
    let subsRoot = columns.eq(2)
    let subsStr = subsRoot.find('span').first().text()
    let subsStr2 = subsRoot.find('[data-do="show_dynamic_participants"]')

    result["channel_id"] = parseInt(subsStr2.first().attr()['data-id'])
    result["subscribers"] = parseInt(subsStr.replace(/[^0-9]/g, ''))

    // Description
    let descRoot = columns.eq(9)
    let descHtml = descRoot.find('div').first().html()
    let descText = htmlToText.fromString(descHtml, { wordwrap: null }) 
    result["description"] = descText

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
        created_at: new Date()
      })
    }
}

// $('#channels_table').find('tbody').find('tr').first().find('td')
const parseTelemetrPage = (htmlPage) => {
    $ = cheerio.load(htmlPage, { decodeEntities: false })    
    let columns = $('#channels_table').find('tbody').find('tr')
    
    for (let infoIdx = 0, categoryIndex = 1; infoIdx < columns.length; categoryIndex += 2, infoIdx += 2) {
      let info = parseInfo(columns.eq(infoIdx))
        const categories = parseCategories(columns.eq(categoryIndex))
        console.log(categories)
        const isExist = categories.filter(item => !blackList.includes(item))
        console.log(isExist)
        if (isExist.length) {
          writeChannelEntry(info)
        }
    }
}

const parseInitial = async () => {
    await db.connect()
    
    let args = process.argv.slice(2);
    let pageIdx = args.length > 0 ? args[0] : 0;

    startInterval(60, () => {
        const pageUrl = getInitialUrl(pageIdx);
        console.log("\nParsing page: " + pageIdx)
        request(pageUrl).then(parseTelemetrPage)
        pageIdx++
    })
}

const parseNew = async () => {
  await db.connect()
  let pageIdx = 1;
    
  startInterval(20, () => {
      const pageUrl = getUrl(pageIdx);
      console.log("\nParsing page: " + pageIdx)
      request(pageUrl).then(parseTelemetrPage)
      pageIdx++
  })
}

module.exports = {
  parseInitial,
  parseNew
}
