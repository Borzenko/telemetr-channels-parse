const cron = require('node-cron')
const parser = require('./parser');


const cronTask = () => {
    cron.schedule('0 */23 * * *', () => {
    console.log('cron started')
    parser.parseNew()
    parser.parseCategory()
  })
}

module.exports={
  cronTask
}