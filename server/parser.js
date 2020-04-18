const request = require('request-promise');
const cheerio = require('cheerio');
const db = require('./db')
const htmlToText = require('html-to-text');

let $;

const getUrl = (page) => {
    return `https://telemetr.me/channels/?page=${page}&participants_from=1000`;
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
    let selectRoot = row.find('select').first()
    
    return selectRoot.find('[selected]').map((index, element) => {        
        return $(element).text()
    }).get()
}

const writeChannelEntry = async (info) => {
    const channels = await db.collection('channels')
    channels.updateOne({ channel_id: info.channel_id }, {
      $set: {
        channel_id: info.channel_id,
        avatar_link: info.avatar_link,
        name: info.name,
        subscribers: info.subscribers,
        description: info.description,
        last_invite_link: info.last_invite_link
      }
    }, { upsert: true })
}

// $('#channels_table').find('tbody').find('tr').first().find('td')
const parseTelemetrPage = (htmlPage) => {
    $ = cheerio.load(htmlPage, { decodeEntities: false })    
    let columns = $('#channels_table').find('tbody').find('tr')
    
    for (let infoIdx = 0; infoIdx < columns.length; infoIdx += 2) {
        let info = parseInfo(columns.eq(infoIdx))
        writeChannelEntry(info)
    }
}

const run = async () => {
    await db.connect()
    
    let args = process.argv.slice(2);
    let pageIdx = args.length > 0 ? args[0] : 1;

    startInterval(20, () => {
        const pageUrl = getUrl(pageIdx);
        console.log("\nParsing page: " + pageIdx)
        request(pageUrl).then(parseTelemetrPage)
        pageIdx++
    })
}

run()