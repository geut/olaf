module.exports = store

function store (state, emitter) {
  state.storeName = 'chat'

  // declare app events
  state.events.SENDMSG = 'chat:send'
  state.chat = state.chat || {}
  state.chat.history = state.chat.history || []
  // sample data
  state.chat.friends = [
    {
      name: 'tincho',
      lastseen: 'a minute ago'
    },
    {
      name: 'masse',
      lastseen: 'a minute ago'
    }
  ]

  emitter.on('DOMContentLoaded', function () {
    emitter.on(state.events.SENDMSG, function (msg) {
      console.log('new msg', msg)
      state.chat.history.push(msg)
      emitter.emit(state.events.RENDER)
    })
  })
}
