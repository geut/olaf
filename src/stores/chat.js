const signalhub = require('signalhub')
const ram = require('random-access-memory')
const saga = require('../lib/saga')
const swarm = require('../lib/discovery-swarm-webrtc')

async function initChat (username, key) {
  const chat = saga(ram, key, username)

  await chat.initialize()

  const hub = signalhub(chat.db.discoveryKey.toString('hex'), ['http://localhost:4000'])

  const sw = swarm(hub, {
    id: chat.db.local.key.toString('hex'),
    stream: () => chat.replicate()
  })

  sw.on('connection', async peer => {
    try {
      await chat.connect(peer)
    } catch (err) {
      console.log(err)
    }
  })

  return chat
}

function store (state, emitter) {
  state.storeName = 'chat'

  // declare app events
  const { events } = state
  events.INIT_CHANNEL = 'chat:init_channel'
  events.JOIN_FRIEND = 'chat:join_friend'
  events.LEAVE_FRIEND = 'chat:leave_friend'
  events.WRITE_MESSAGE = 'chat:write_message'
  events.ADD_MESSAGE = 'chat:add_message'

  let chat

  state.chat = {
    key: null,
    username: null,
    messages: [],
    friends: []
  }

  emitter.on('DOMContentLoaded', function () {
    initialize()
    emitter.on(events.INIT_CHANNEL, initChannel)
    emitter.on(events.ADD_MESSAGE, addMessage)
    emitter.on(events.WRITE_MESSAGE, writeMessage)
    emitter.on(events.JOIN_FRIEND, joinFriend)
    emitter.on(events.LEAVE_FRIEND, leaveFriend)
  })

  function initialize () {
    // Al principio debemos chequear un par de cosas:
    //   - cual es mi usuario
    //   - si existe un channel o debo crearlo
    //   Usaremos el localStorage para almacenar estos valores.
    const data = JSON.parse(window.localStorage.getItem('olaf'))

    if (!data) {
      return
    }

    state.chat.username = data.username
    state.chat.key = data.key

    render()
  }

  async function initChannel (username, key) {
    state.chat.username = username

    chat = await initChat(username, key)

    state.chat.key = chat.db.key.toString('hex')

    chat.on('message', data => {
      emitter.emit(events.ADD_MESSAGE, data)
    })

    chat.on('join', user => {
      emitter.emit(events.JOIN_FRIEND, user)
    })

    chat.on('leave', user => {
      emitter.emit(events.LEAVE_FRIEND, user)
    })

    render()
  }

  function writeMessage (msg) {
    chat.writeMessage(msg)
    render()
  }

  function joinFriend (user) {
    const index = state.chat.friends.findIndex(u => u.username === user.username)
    if (index !== -1) state.chat.friends.splice(index, 1)
    state.chat.friends.push(user)
    render()
  }

  function leaveFriend (user) {
    const index = state.chat.friends.findIndex(u => u.username === user.username)
    if (index !== -1) {
      state.chat.friends.splice(index, 1)
      render()
    }
  }

  function addMessage (data) {
    state.chat.messages.push(data)
    render()
  }

  function render () {
    emitter.emit('render')
  }
}

module.exports = store
