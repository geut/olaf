const html = require('choo/html')

const modal = require('../components/modal')
const InputMsg = require('../components/input-msg')
const ViewMessages = require('../components/view-messages')
const Users = require('../components/users')

const TITLE = 'olaf - a P2P Dat-powered chat'

module.exports = view

const statusChannel = ({ key, init }) => {
  if (!key || !init) return null

  return html`
    <h4 class="pre mt0 f6 f5-ns" style="overflow-wrap: break-word;">Connected to: ${key}</h4>
  `
}

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  const { username, key, init } = state.chat

  return html`
    <body class="code lh-copy">
      <main class="pa3 flex flex-column dt w-100 h-100">
        <div class="logo w-100">
          <h1 class="f2 mt0 mb0">olaf 🐱</h1>
          ${statusChannel({ init, key })}
        </div>
        <div class="flex w-100 justify-between flex-column-reverse flex-row-ns flex-grow-1">
          ${state.cache(ViewMessages, 'viewMessages').render()}
          <aside class="w-100 w-30-ns pa1-ns ba b--silver b--dashed br3 overflow-auto">
            ${init ? state.cache(Users, 'users').render() : ''}
          </aside>
        </div>
        <section class="w-100 pa0 mt2 mb2">
          ${state.cache(InputMsg, 'inputMsg').render()}
        </section>
      </main>
      ${(!init) ? modal({ username, key }, this.emit, this.state.events) : ''}
    </body>
  `
}
