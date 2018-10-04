const html = require('choo/html')
const copy = require('copy-to-clipboard')

const clipboardIcon = require('./icons/clipboard')

module.exports = function modal (props, emit, events) {
  const { key } = props
  const { HIDE_MODAL_KEY } = events

  function hideModalKey () {
    emit(HIDE_MODAL_KEY)
  }

  function copyToClipboard (e) {
    e.preventDefault()
    copy(key)
  }

  return html`
    <div class="modal-overlay" onclick=${hideModalKey}>
      <div
        class="break-word mw-100 w-80 w-60-ns fixed z-5 center ph3 ph5-ns tc br2 pv3 pv5-ns bg-washed-green dark-green mb"
        style="transform: translate(-50%, -50%);left: 50%; top: 50%; max-height: 100%"
        >
        <a href="#" class="link dim light-purple" onclick=${copyToClipboard}>
          ${key}
          <div class="dib ml2" style="width: 25px; height: 25px;">${clipboardIcon()}</div>
        </a>
      </div>
    </div>
  `
}
