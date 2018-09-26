const EventEmitter = require('events')
const hyperdb = require('hyperdb')
const writer = require('flush-write-stream')
const pump = require('pump')
const hyperid = require('hyperid')
const uuid = hyperid()

class Saga extends EventEmitter {
  constructor (storage, key, username) {
    super()

    this.messages = new Map()
    this.users = new Map()
    this.username = username
    this.db = hyperdb(storage, key, { valueEncoding: 'json' })
  }

  async initialize () {
    await this.ready()

    this._updateHistory()

    this.db.watch('messages', () => {
      this._updateHistory()
    })
  }

  ready () {
    return new Promise(resolve => this.db.ready(resolve))
  }

  writeMessage (message) {
    const key = `messages/${uuid()}`
    const data = {
      key,
      message,
      username: this.username,
      timestamp: Date.now()
    }

    return new Promise((resolve, reject) => {
      this.db.put(key, data, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  replicate () {
    return this.db.replicate({
      live: true,
      userData: JSON.stringify({
        key: this.db.local.key,
        username: this.username,
        timestamp: Date.now()
      })
    })
  }

  async connect (peer) {
    if (!peer.remoteUserData) {
      throw new Error('peer does not have userData')
    }

    const data = JSON.parse(peer.remoteUserData)

    const key = Buffer.from(data.key)
    const username = data.username

    await this._authorize(key)

    if (!this.users.has(username)) {
      this.users.set(username, new Date())
      this.emit('join', data)
      peer.on('close', () => {
        if (!this.users.has(username)) return
        this.users.delete(username)
        this.emit('leave', data)
      })
    }
  }

  _authorize (key) {
    return new Promise((resolve, reject) => {
      this.db.authorized(key, (err, auth) => {
        if (err) return reject(err)

        if (auth) {
          return resolve()
        }

        this.db.authorize(key, (err) => {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  }

  _updateHistory () {
    const h = this.db.createHistoryStream({ reverse: true })

    const ws = writer.obj((data, enc, next) => {
      const { key, value } = data

      if (/messages/.test(key)) {
        if (this.messages.has(key)) {
          h.destroy()
          return
        }

        this.messages.set(key, value)
        this.emit('message', value, key)
      }

      next()
    })

    pump(h, ws)
  }
}

module.exports = (...args) => new Saga(...args)
