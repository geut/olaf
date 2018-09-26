// swarm == enjambre
const assert = require('assert')
const Emitter = require('events')
const swarmDefaults = require('dat-swarm-defaults')
const discovery = require('discovery-swarm')
const webrtc = require('webrtc-swarm')

const DISCOVERY = 'discovery'
const WEBRTC = 'webrtc'
const MULTI = 'multiple'

/**
 * USAGE:
 *
 * const Swarm = require('./swarm')
 *
 *** simple, creates a discovery-swarm  **
 * const swarm = Swarm()
 *
 *** webrtc swarm **
 * const swarm = Swarm({ type: 'webrtc', hub: 'somehub.hubby.hub' })
 *
 */

class Swarm extends Emitter {
  constructor (opts = {}) {
    super(opts)
    assert(typeof opts.db === 'object', 'opts.db is a required param') // db is a hyperdb instance

    this.db = opts.db
    this.instance = null

    this.EVENTS = {
      CONNECTION: 'connection',
      CLOSE: 'connection:close',
      CONNECTION_FAIL: 'connection:fail',
      JOIN: 'join',
      LEAVE: 'leave'
    }

    this.EVENTS_MAP = {
      CONNECTION: ['connection', 'peer'],
      CLOSE: ['connection-closed', 'close'],
      CONNECTION_FAIL: ['connect-failed'],
      JOIN: ['peer'],
      LEAVE: ['connection-closed', 'close']
    }

    this.connections = [] // maybe rename to peers?
    // bind local methods
    this.onConnection.bind(this)
    this.onClose.bind(this)
    this.onJoin.bind(this)
    this.onLeave.bind(this)
    this.onFail.bind(this)

    if (!opts.type) {
      opts.type = DISCOVERY // we can try MULTI as a default later
    }

    if (opts.type === MULTI) {
      this._createSwarm(swarmDefaults(opts))
      this._createWebrtcSwarm(opts)
      return this
    }
    if (opts.type === DISCOVERY) this._createSwarm(swarmDefaults(opts))
    if (opts.type === WEBRTC) this._createWebrtcSwarm(opts)
  }

  _createSwarm () {
    this.instance = discovery(swarmDefaults(this.opts)) // merge with Dat swarm defaults
    this.instance.join(this.db.key.toString('hex'))
    this.instance.on('connection', this.onConnection)
    this.instance.on('connection-closed', this.onClose)
    this.instance.on('connection-failed', this.onConnectionFail)
  }

  _createWebrtcSwarm () {
    assert(typeof this.opts.hub === 'string', 'For webrtc swarms, hub is required')
    this.instance = webrtc(this.opts.hub, this.opts)
    this.instance.on('connect', this.onConnection)
  }

  onConnection (connection, info) {
    // do something on connection
    this.emit(this.EVENTS.CONNECTION, { connection, info })
  }

  onClose (connection, info) {
    // do something on close
    this.emit(this.EVENTS.CLOSE, { connection, info })
  }

  onJoin () {
    // emit joined peer
    this.emit(this.EVENTS.JOIN, {}) // emit userData
  }

  onLeave (connection, info) {
    this.emit(this.EVENTS.LEAVE, { connection, info })
  }

  onConnectionFail (peer, details) {
    // do something onfail
    this.emit(this.EVENTS.CONNECTION_FAIL, { peer, details })
  }
}

module.exports = (opts) => new Swarm(opts)
