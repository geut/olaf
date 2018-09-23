// swarm == enjambre
const assert = require('assert')
const swarmDefaults = require('dat-swarm-defaults')
const discovery = require('discovery-swarm')

const NODE = 'discovery'
const WEBRTC = 'webrtc'
const CUSTOM = 'custom'

/**
 * USAGE:
 * const Swarm = require('./swarm')
 *
 ** ALT 1 **
 * const discoverySwarm = Swarm({ db: myHyperdb }) // creates a swarm using discovery-swarm with dat-swarm-defaults
 *
 ** ALT 2 **
 * const webrtcSwarm = Swarm({ db: myHyperdb, hub: mySignalHub }) // creates a swarm using webrtc-swarm
 *
 * ALT 3 **
 * const customDiscoverySwarm = Swarm({ db: myHyperdb, opts: customOpts }) // creates a discovery swarm with custom opts merged with defaults
 *
 * ALT 4 **
 * const customWebrtcSwarm = Swarm({ db: myHyperdb, hub: mySignalHub, opts: customOpts }) // creates a webrtc swarm with custom opts
 *
 * ALT 5 **
 * const xSwarm = Swarm({ db: myHyperdb, swarm: customSwarmConstructor, opts: customOpts }) // creates a custom swarm with custom opts
 */

module.exports = ({ db, swarm = discovery, opts = {} }) => {
  // db is required
  assert(typeof db === 'object', 'db is required')

  // create your swarm
  let swarmInstance

  if (typeof swarm.join === 'function') {
    // merge with Dat swarm defaults
    opts = swarmDefaults(opts)
    // discovery swarm like API
    swarmInstance = swarm(opts)
    swarmInstance.type = NODE
    swarm.join(db.key.toString('hex'))
    swarmInstance.on('connection', db.onconnection.bind(db))
  }
  if (opts.hub) {
    // webrtc-swarm like API
    swarmInstance = swarmInstance(opts.hub, opts)
    swarmInstance.type = WEBRTC
    swarmInstance.on('connect', db.onconnection.bind(db))
  } else {
    assert(typeof opts === 'object', 'For custom swarms opts must be defined')
    assert(opts.connectionKey && typeof opts.connectionKey === 'string', 'For custom swarms opts.connectionkey must be defined')
    swarmInstance = swarm(opts)
    swarmInstance.type = CUSTOM
    swarmInstance.on(opts.connectionKey, db.onconnection.bind(db))
  }

  return swarmInstance
}
