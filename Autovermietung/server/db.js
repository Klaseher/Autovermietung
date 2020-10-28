'use strict'
const sqlite3 = require('sqlite3').verbose()

class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
    this.createTable()
  }

  createTable () {
    const sql = `
            CREATE TABLE IF NOT EXISTS user (
                id integer PRIMARY KEY,
                name text NOT NULL,
                email text UNIQUE NOT NULL,
                user_pass text NOT NULL,
                is_admin integer NOT NULL)`
    return this.db.run(sql)
  }

  insert (user, callback) {
    return this.db.run(
      'INSERT INTO user (name,email,user_pass,is_admin) VALUES (?,?,?,?)',
      user, (err) => {
        callback(err)
      })
  }

  selectByEmail (email, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE email = ?`,
      [email], function (err, row) {
        callback(err, row)
      })
  }
  selectById (id, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE id = ?`,
      [id], function (err, row) {
        callback(err, row)
      })
  }

  getAllEmployees (callback) {
    let users = []
    return this.db.all(
      `SELECT name, email FROM user WHERE is_admin = ?`,
      ['1'], function (err, rows) {
        rows.forEach(function (row) {
          users.push(row)
        })
        callback(err, users)
      })
  }
}

module.exports = Db
