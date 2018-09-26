const html = require('choo/html')

module.exports = ({ username, message }) => {
  return html`
    <p class="f5 lh-copy measure-wide">${username}: ${message}</p>
  `
}
