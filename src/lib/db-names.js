const dbs = JSON.parse(window.localStorage.getItem('olaf/dbs')) || []

export const addDB = (dbName, pubKey) => {
  dbs.push({ dbName, pubKey })
  window.localStorage.setItem('olaf/dbs', JSON.stringify(dbs))
  return dbName
}

export const getDB = pubKey => {
  const db = dbs.find(db => db.pubKey === pubKey)
  if (db) {
    return db.dbName
  }

  return addDB(`olaf-${Date.now()}`, pubKey)
}

export const updateDB = (dbName, pubKey) => {
  const db = dbs.find(db => db.dbName === dbName)
  db.pubKey = pubKey
  window.localStorage.setItem('olaf/dbs', JSON.stringify(dbs))
}
