module.exports = store

function store (state, emitter) {
  state.storeName = 'chat'

  // declare app events
  const { events } = state
  events.UPDATE_USERNAME = 'chat:update_username'
  events.CREATE_CHANNEL = 'chat:create_channel'
  events.CONNECT_CHANNEL = 'chat:connect_channel'
  events.JOIN_FRIEND = 'chat:join_friend'
  events.LEAVE_FRIEND = 'chat:leave_friend'
  events.ADD_MESSAGE = 'chat:add_message'

  state.chat = {
    username: null,
    currentChannel: null,
    messages: [],
    friends: [
      {
        name: 'tincho',
        lastseen: 'a minute ago'
      },
      {
        name: 'masse',
        lastseen: 'a day ago'
      }
    ]
  }

  emitter.on('DOMContentLoaded', function () {
    emitter.on(events.UPDATE_USERNAME, updateUsername)
    emitter.on(events.CREATE_CHANNEL, createChannel)
    emitter.on(events.CONNECT_CHANNEL, connectChannel)
    emitter.on(events.ADD_MESSAGE, addMessage)
  })

  function updateUsername (username) {
    state.chat.username = username
    render()
  }

  function createChannel () {
    state.chat.currentChannel = new Date()
    render()
  }

  function connectChannel () {}

  function addMessage (msg) {
    state.chat.messages.push(msg)
    render()
  }

  function render () {
    emitter.emit('render')
  }
}
