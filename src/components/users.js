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
    this.local.toggleList = undefined
  }

  update () {
    if (this.state.chat.friends.length !== this.local.friends.length) return true
    if (typeof this.local.toggleList === 'boolean') return true
    return false
  }

  toggleFriends = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.listEl = this.element.querySelector('.list')
    console.log(this.listEl)
    if ('undefined' === typeof this.local.toggleList) {
      this.local.toggleList = true;
    } else {
      this.local.toggleList = !this.local.toggleList;
    }
    this.listEl.classList.toggle('dn', ('boolean' === typeof this.local.toggleList && !this.local.toggleList))
    this.listEl.classList.toggle('vh-25', ('boolean' === typeof this.local.toggleList && this.local.toggleList))
  }

  createElement () {
    return html`
      <div class="">
        <h2 class="f2 tc ma0 ph3 ph0-ns measure">
          <a href="#" class="link dim dark-gray" onclick=${this.toggleFriends}>
            Friends
          </a>
        </h2>
        <ul class="list dn db-ns pa3 pa0-ns mt0 measure center">
          ${this.local.friends.map(user)}
        </ul>
      </div>
    `
  }
}
