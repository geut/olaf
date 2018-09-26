const component = require('choo/component')
const html = require('choo/html')

const user = require('./user')

module.exports = class Users extends component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
    this.local = this.state.components[name] = {}
    this.updateLocal()
  }

  updateLocal () {
    const { chat: { friends, username } } = this.state

    this.local.friends = friends.slice()
    this.local.friends.sort((a, b) => a.timestamp - b.timestamp)
    this.local.username = username
    this.local.toggleList = undefined
  }

  update () {
    const { chat: { friends, username } } = this.state

    let update = friends.length !== this.local.friends.length
    update = update || typeof this.local.toggleList === 'boolean'
    update = update || username !== this.local.username

    if (update) {
      this.updateLocal()
      return true
    }

    return false
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
      <div class="">
        <h2 class="f2 tc ma0 ph3 ph1-ns measure">
          <a href="#" class="link dim dark-gray" onclick=${this.toggleFriends}>
            Users
          </a>
        </h2>
        <ul class="list dn db-ns pa3 pa0-ns mt0 measure center">
          ${this.local.username ? user({ username: this.local.username }) : null}
          ${this.local.friends.map(user)}
        </ul>
      </div>
    `
  }
}
