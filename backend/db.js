const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./quadratic.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to sqlite database.');
});
 
db.serialize(async () => {
  
  db.run("CREATE TABLE IF NOT EXISTS polls (id INTEGER PRIMARY KEY ASC, question TEXT, type TEXT, closed BOOLEAN DEFAULT 0)");
  db.run("CREATE TABLE IF NOT EXISTS pollItems (id INTEGER PRIMARY KEY ASC, answer TEXT, correct BOOLEAN, pollsId INT, FOREIGN KEY(pollsId) REFERENCES polls(id))");
  db.run("CREATE TABLE IF NOT EXISTS topPoll (id INTEGER PRIMARY KEY ASC, pollsId INT, FOREIGN KEY(pollsId) REFERENCES polls(id))");
  db.run("CREATE TABLE IF NOT EXISTS hasVoted (id INTEGER PRIMARY KEY ASC, sessionId TEXT, pollsId INT, FOREIGN KEY(pollsId) REFERENCES polls(id))");
  db.run("CREATE TABLE IF NOT EXISTS votes " +
  	"(id INTEGER PRIMARY KEY ASC, pollsId INT, pollItemsId INT," +
  	"FOREIGN KEY(pollsId) REFERENCES polls(id), FOREIGN KEY(pollItemsId) REFERENCES pollItems(id))");
});

module.exports = db