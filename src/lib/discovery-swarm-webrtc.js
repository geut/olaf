const assert = require('assert')
const EventEmitter = require('events')
const swarm = require('webrtc-swarm')
const pump = require('pump')

const _handshake = Symbol('handshake')

class DiscoverSwarmWebrtc extends EventEmitter {
  constructor (hub, opts = {}) {
    super()

    assert(hub && typeof hub === 'object', 'A SignalHub instance is required.')
    assert(typeof opts.stream === 'function', 'A `stream` function prop is required.')

    this.sw = swarm(hub, {
      uuid: opts.id || opts.uuid,
      wrtc: opts.wrtc
    })

    this.peers = new Map()

    this.sw.on('peer', (peer, id) => {
      const conn = opts.stream()
      conn.on('handshake', this[_handshake].bind(this, conn, id))
      pump(peer, conn, peer)
    })

    this.sw.on('disconnect', (peer, id) => {
      this.peers.delete(id)
      this.emit('connection-closed', peer)
    })
  }

  [_handshake] (conn, id) {
    if (this.peers.has(id)) {
      const oldPeer = this.peers.get(id)
      this.peers.delete(id)
      oldPeer.destroy()
    }

    this.peers.set(id, conn)
    this.emit('connection', conn)
  }
}

module.exports = (...args) => new DiscoverSwarmWebrtc(...args)
