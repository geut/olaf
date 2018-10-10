const signalhub = require('signalhub')
const ram = require('random-access-memory')
const saga = require('../lib/saga')
const swarm = require('@geut/discovery-swarm-webrtc')

const webrtcOpts = {}
if (process.env.ICE_URLS) {
  webrtcOpts.config = {
    iceServers: process.env.ICE_URLS.split(',').map(urls => ({ urls }))
  }
}

async function initChat (username, key) {
  const publicKey = key && key.length > 0 ? key : null
  const chat = saga(ram, publicKey, username)

  await chat.initialize()

  const sw = swarm({
    id: chat.db.local.key.toString('hex'),
    stream: () => chat.replicate()
  })

  const discoveryKey = chat.db.discoveryKey.toString('hex')
  const signalUrls = process.env.SIGNAL_URLS ? process.env.SIGNAL_URLS.split(',') : ['http://localhost:4000']

  sw.join(signalhub(discoveryKey, signalUrls), webrtcOpts)

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
  events.UPDATE_USERNAME = 'chat:update_username'
  events.UPDATE_KEY = 'chat:update_key'
  events.JOIN_FRIEND = 'chat:join_friend'
  events.LEAVE_FRIEND = 'chat:leave_friend'
  events.WRITE_MESSAGE = 'chat:write_message'
  events.ADD_MESSAGE = 'chat:add_message'

  let chat

  state.chat = {
    initChannel: false,
    key: null,
    username: null,
    userTimestamp: null,
    messages: [],
    friends: []
  }

  emitter.on('DOMContentLoaded', function () {
    rehydrate()
    emitter.on(events.INIT_CHANNEL, initChannel)
    emitter.on(events.UPDATE_USERNAME, updateUsername)
    emitter.on(events.UPDATE_KEY, updateKey)
    emitter.on(events.ADD_MESSAGE, addMessage)
    emitter.on(events.WRITE_MESSAGE, writeMessage)
    emitter.on(events.JOIN_FRIEND, joinFriend)
    emitter.on(events.LEAVE_FRIEND, leaveFriend)
  })

  function rehydrate () {
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

  async function initChannel (isNew = false) {
    chat = await initChat(state.chat.username, isNew ? null : state.chat.key)

    state.chat.key = chat.db.key.toString('hex')
    state.chat.userTimestamp = Date.now()
    state.chat.init = true

    window.localStorage.setItem('olaf', JSON.stringify({ username: state.chat.username, key: state.chat.key }))

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

  function updateUsername (username) {
    state.chat.username = username
    render()
  }

  function updateKey (key) {
    state.chat.key = key
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
