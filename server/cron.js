const cron = require('node-cron')
const parser = require('./parser');

parser.parseNew()
// const cronTask = cron.schedule('0 */23 * * *', () => {
//   parser.parseNew()
// })

// module.exports={
//   cronTask
// }