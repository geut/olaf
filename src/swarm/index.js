// swarm == enjambre
const swarmDefaults = require('dat-swarm-defaults')
const discovery = require('discovery-swarm')

module.exports = ({ db, swarm = discovery, opts = {} }) => {
  if (!opts.id) {
    // if empty options, then we will use Dat swarmDefaults
    opts = swarmDefaults({
      id: db.getId(),
      stream: peer => {
        return db.replicate()
      }
    })
  }
  // create your swarm
  let swarmInstance

  if (typeof swarm.join === 'function') {
    // discovery swarm like API
    swarmInstance = swarm(opts)
    const key = db.getAddr() || db.getKey()
    swarm.join(key.toString('hex'))
    swarmInstance.on('connection', db.onconnection.bind(db))
  } else {
    // webrtc-swarm like API
    swarmInstance = swarmInstance(opts.hub, opts)
    swarmInstance.on('connect', db.onconnection.bind(db))
  }
  return swarmInstance
}
