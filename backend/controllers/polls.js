const e = require('cors')
const db = require('../db')

const readPolls = (req, res)  => {
  if (req.params.top) {
    console.log("calling read with all")
    // TO-DO parse int on id
    return db.get(`SELECT * FROM topPoll WHERE ID = 1;`, async (err1, row) => {
      if (err1) {
        console.log(err1)
        return res.status(500).json({ error: 'Server Error' });
      }
      if (!row) return res.status(401).json({ error: 'Not found' });
      console.log(row.pollsId)
      const query = `SELECT polls.id, question, type, correct, answer, closed, pollItems.id as pollItemsId, 
      (select COUNT(votes.id) from votes where votes.pollItemsId = pollItems.id) as votes
      FROM polls 
      INNER JOIN pollItems ON pollItems.pollsId = polls.id 
      WHERE polls.id IS ${row.pollsId};`

      return db.all(query, async (err, poll) => {
        if (err) {
          console.log(err)
          return res.status(500).json({ error: 'Server Error' });
        }
        console.log("poll", poll)
        if (!poll) return res.status(401).json({ error: 'Not found' });
        return res.status(200).json({ poll })
      })
    })

  }
  //return db.all(`SELECT question, answer, pollsId FROM polls INNER JOIN pollItems ON pollItems.pollsId = polls.id;`, async (err, polls) => {
  return db.all(`SELECT id, question, type FROM polls;`, async (err, polls) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server Error' });
    }
    console.log(polls)
    if (!polls) return res.status(401).json({ error: 'No polls' });
    return res.status(200).json({ polls })
  })
}

const createPoll = (req, res) => {
  let pollId
  const { question, type, answers } = req.body
  console.log(answers)
  // must use old function notation
  db.run("INSERT INTO polls(question, type) VALUES (?, ?)", question, type, function(err) {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Server Error' });
    }
    console.log(`inserted question ${this.lastID}`)
    pollId = this.lastID
    const stmt = db.prepare("INSERT INTO pollItems(answer, correct, pollsId) VALUES (?, ?, ?)");
    answers.map((a) => {
      return stmt.run([a.answer, a.correct, pollId]);
    })
    stmt.finalize();
    // db.each("SELECT rowid AS id, answer, pollsId FROM pollItems", function(err, row) {
    //     console.log(row.id + ": " + row.answer + ' ' + row.pollsId);
    // });
    res.status(200).json(`Create poll ${pollId}`)
  })
}

const updatePoll = (req, res)  => {
  console.log('set top poll')
  let pollId
  const { topPoll } = req.body
  db.run("INSERT OR REPLACE INTO topPoll (ID, pollsId) VALUES (1, ?);" , topPoll, function(err) {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Server Error' });
    }
    console.log(`updated top poll to ${topPoll}`)
    db.get("SELECT * FROM topPoll WHERE ID = 1;", function(err, row) {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Server Error' });
      }
      console.log('Row from topPoll table:', row);
      res.status(200).json(`Update poll ${topPoll}`)
    });
    
  })
}

const deletePoll = (req, res)  => {
  const { toClose } = req.body
  console.log(req.body)
  return db.run("UPDATE polls SET closed = 1 WHERE id = ?;", toClose, function(err) {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Server Error' });
    }
    db.get("SELECT * FROM polls WHERE ID = ?;", toClose, function(err, row) {
      console.log(`closing poll ${toClose}`)
      console.log(row)
      return res.status(200).json(`Close poll ${toClose}`)
    })
  })
}

module.exports = {
  readPolls,
  createPoll,
  updatePoll,
  deletePoll
}