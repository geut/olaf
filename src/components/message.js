const html = require('choo/html')
const tinydate = require('tinydate').default

const stamp = tinydate('[{DD}/{MM}/{YYYY} {HH}:{mm}:{ss}]')

module.exports = ({ username, message, timestamp }) => {
  const date = stamp(new Date(timestamp))

  return html`
    <p class="f5 lh-copy measure-wide">${date} ${username}: ${message}</p>
  `
}
