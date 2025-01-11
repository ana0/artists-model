const e = require('cors')
const db = require('../db')

const readSessions = (req, res, next)  => {
  if (req.params.top) {
    console.log("calling get current session")
    // TO-DO parse int on id
    return db.get(`SELECT * FROM topSession WHERE ID = 1;`, async (err, session) => {
      if (err) next(err);
      if (!session) return res.status(401).json({ error: 'No top session found' });
      console.log(session.id)
      return db.get(`SELECT * FROM topPoll WHERE ID = 1;`, async (err1, poll) => {
        if (err1) next(err1);
        if (!poll) return res.status(401).json({ error: 'No top poll found' });
        return res.status(200).json({ session, poll })
      })
    })
  }
  return db.all(`SELECT id, name FROM sessions;`, async (err, sessions) => {
    if (err) next(err);
    console.log(sessions)
    if (!sessions) return res.status(401).json({ error: 'No sessions' });
    return res.status(200).json({ sessions })
  })
}

const createSession = (req, res, next) => {
  let sessionId
  const { name, pollsId } = req.body
  // must use old function notation
  db.run("INSERT INTO sessions(name, pollsId) VALUES (?, ?)", name, pollsId, function(err) {
    if (err) next(err);
    console.log(`inserted session ${this.lastID}`)
    sessionId = this.lastID
    res.status(200).json(`Create session ${sessionId}`)
  })
}

const updateSession = (req, res)  => {
  console.log('set current session')
  let sessionId
  const { topSession } = req.body;
  // set top session
  db.run("INSERT OR REPLACE INTO topSession (ID, sessionId) VALUES (1, ?);" , topSession, function(err) {
    if (err) next(err);
    console.log(`updated current session to ${topSession}`)
    // get starting poll for top session
    db.get("SELECT * FROM sessions WHERE ID = ?;", topSession, function(err, session) {
      if (err) next(err);
      console.log('Starting poll for current session:', row.pollsId);
      // set top poll to be starting poll for current session
      db.run("INSERT OR REPLACE INTO topPoll (ID, pollsId) VALUES (1, ?);" , row.pollsId, function(err) {
        if (err) next(err);
        console.log(`updated top poll to ${row.pollsId}`)
        return res.status(200).json(`Set current session ${topSession}`)
      });
    });
  })
}

module.exports = {
  readSessions,
  createSession,
  updateSession,
}