const component = require('choo/component')
const html = require('choo/html')

const user = require('./user')

module.exports = class Users extends component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
    this.local = this.state.components[name] = {}
    this.setState()
  }

  setState () {
    // sample data
    this.local.friends = this.state.chat.friends
  }

  update () {
    if (this.state.chat.friends.length !== this.local.friends.length) return true
    return false
  }

  createElement () {
    return html`
      <ul class="list pa3 pa0-ns mt0 measure center">
        ${this.local.friends.map(user)}
      </ul>
    `
  }
}
