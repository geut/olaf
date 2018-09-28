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
    const { chat: { friends, username, userTimestamp } } = this.state

    this.local.friends = friends.slice()
    this.local.friends.sort((a, b) => a.timestamp - b.timestamp)
    this.local.username = username
    this.local.userTimestamp = userTimestamp
    this.local.toggleList = undefined
  }

  update () {
    const { chat: { friends, username } } = this.state

    let updateState = friends.length !== this.local.friends.length
    updateState = updateState || typeof this.local.toggleList === 'boolean'
    updateState = updateState || username !== this.local.username

    if (updateState) {
      this.setState()
    }

    return true
  }

  toggleFriends = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.listEl = this.element.querySelector('.list')
    if (typeof this.local.toggleList === 'undefined') {
      this.local.toggleList = true
    } else {
      this.local.toggleList = !this.local.toggleList
    }
    this.listEl.classList.toggle('dn', (typeof this.local.toggleList && !this.local.toggleList === 'boolean'))
    this.listEl.classList.toggle('vh-25', (typeof this.local.toggleList && this.local.toggleList === 'boolean'))
  }

  createElement () {
    return html`
      <div>
        <h2 class="f2 tc ma0 ph3 ph1-ns measure">
          <a href="#" class="link dim dark-gray" onclick=${this.toggleFriends}>
            Users
          </a>
        </h2>
        <ul class="list dn db-ns pa3 pa0-ns mt0 measure center overflow-auto">
          ${this.local.username ? user({ owner: true, username: this.local.username, timestamp: this.local.userTimestamp }) : null}
          ${this.local.friends.map(user)}
        </ul>
      </div>
    `
  }
}
