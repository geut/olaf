const Component = require('choo/component')
const html = require('choo/html')

const message = require('./message')

module.exports = class ViewMessages extends Component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
    this.local = this.state.components[name] = {}
    this.setState()
  }

  setState () {
    this.local.messages = this.state.chat.messages.slice()
    this.local.messages.sort((a, b) => a.timestamp - b.timestamp)
  }

  update () {
    const { chat: { messages } } = this.state
    if (this.local.messages.length !== messages.length) {
      this.setState()
      return true
    }
  }

  createElement () {
    return html`
      <section
        id="olaf-chat"
        class="w-100 w-60-ns shadow-5 vh-75  pa3 ba b--silver b--dashed br3 cover overflow-auto mt2 mt0-ns"
        >
        ${this.local.messages.map(m => message(m))}
      </section>
    `
  }

  afterupdate () {
    this.element.scrollTo(0, this.element.scrollHeight)
  }
}
