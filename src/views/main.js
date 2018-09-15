const html = require('choo/html')

const inputMsg = require('../components/input-msg')
const msg = require('../components/message')
const users = require('../components/users')

const TITLE = 'olaf - P2P Dat-powered chat'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy vh-100">
      <main class="pa3 flex flex-wrap justify-between vh-100 dt w-100">
        <div class="logo w-100">
          <h1> CHAT MSGs 🐱 </h1>
        </div>
        <section id="olaf-chat" class="vh-100 w-100 w-60-ns pa3 ba b--silver b--dashed br3 cover overflow-auto">
        ${state.chat.history.map(m => msg(m))}
        </section>
        <aside class="w-100 dn db-ns w-30-ns pa1-ns ba b--silver b--dashed br3 mt2 mt0-ns overflow-auto">
          ${state.cache(users, 'users').render()}
        </aside>
        <section class="w-100 pa0 mt2">
          ${state.cache(inputMsg, 'inputMsg').render()}
        </section>
      </main>
    </body>
  `
}
