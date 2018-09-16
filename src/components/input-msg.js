const Component = require('choo/component')
const html = require('choo/html')

module.exports = class InputMsg extends Component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
  }

  update () {
    return false
  }

  sendMessage = (e) => {
    e.preventDefault()
    const { events } = this.state
    const input = this.element.querySelector('#input-msg')
    this.emit(events.ADD_MESSAGE, input.value)
    input.value = ''
  };

  createElement () {
    return html`
      <form>
        <fieldset class="cf bn ma0 pa0">
          <div class="cf">
            <label class="clip" for="Message">Message</label>
            <input
              class="f6 f5-l input-reset bn fl pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
              placeholder="Message..."
              autofocus
              type="text"
              name="chat-msg"
              id="input-msg">
            <input
              class="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
              type="submit"
              value="Send"
              onclick=${this.sendMessage}>
          </div>
        </fieldset>
      </form>
    `
  }
}
