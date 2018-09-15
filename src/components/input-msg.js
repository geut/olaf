const component = require('choo/component')
const html = require('choo/html')

module.exports = class InputMsg extends component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
    this.local = this.state.components[name] = {}
    this.setState()
  }

  setState () {
    this.local.message = ''
  }

  update () {
    if (this.local.message === '') return true

    return false
  }

  sendMessage = (e) => {
    e.preventDefault()
    const { message } = this.local
    this.emit(this.state.events.SENDMSG, message)
    this.local.message = ''
  };

  updateMessage = (e) => {
    const { target } = e
    const { value } = target
    this.local.message = value
  };

  createElement () {
    return html`
      <div class="pa4-l">
        <form class="mw7 center pa4 br2-ns ba b--black-10">
          <fieldset class="cf bn ma0 pa0">
            <div class="cf">
              <label class="clip" for="Message">Message</label>
              <input class="f6 f5-l input-reset bn fl pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns" placeholder="Message..." autofocus type="text" name="chat-msg" value="${this.local.message}" id="chat-msg" onkeyup=${this.updateMessage}>
              <input class="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns" type="submit" value="Send" onclick=${this.sendMessage}>
            </div>
          </fieldset>
        </form>
      </div>
    `
  }
}
