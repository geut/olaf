const html = require('choo/html')

const InputMsg = require('../components/input-msg')
const ViewMessages = require('../components/view-messages')
const Users = require('../components/users')

const TITLE = 'olaf - P2P Dat-powered chat'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy vh-100">
      <main class="pa3 flex flex-wrap justify-between vh-100 dt w-100">
        <div class="logo w-100">
          <h1>olaf 🐱</h1>
        </div>
        ${state.cache(ViewMessages, 'viewMessages').render({ messages: state.chat.messages })}
        <aside class="w-100 dn db-ns w-30-ns pa1-ns ba b--silver b--dashed br3 mt2 mt0-ns overflow-auto">
          ${state.cache(Users, 'users').render()}
        </aside>
        <section class="w-100 pa0 mt2">
          ${state.cache(InputMsg, 'inputMsg').render()}
        </section>
      </main>
    </body>
  `
}
