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
                vorname text NOT NULL,
                email text UNIQUE NOT NULL,
                address text NOT NULL,
                telephone text,
                user_pass text NOT NULL,
                is_admin integer NOT NULL,
                resetToken text,
                expire datetime)`
    return this.db.run(sql)
  }

  insert (user, callback) {
    return this.db.run(
      'INSERT INTO user (name, vorname, email, user_pass, address, telephone, is_admin) VALUES (?,?,?,?,?,?,?)',
      user, (err) => {
        callback(err)
      })
  }

  updateReset (reset, callback) {
    return this.db.run(
      'UPDATE user SET resetToken = ?, expire = ? WHERE id = ?',
      reset, (err) => {
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
      `SELECT id, name, email FROM user WHERE is_admin = ?`,
      ['1'], function (err, rows) {
        rows.forEach(function (row) {
          users.push(row)
        })
        callback(err, users)
      })
  }

  updateName (name, id, callback) {
    return this.db.get(
      `UPDATE user SET name = ? WHERE id = ?`,
      [name, id], function (err, row) {
        callback(err, row)
      })
  }
  updateMail (email, id, callback) {
    return this.db.get(
      `UPDATE user SET email = ? WHERE id = ?`,
      [email, id], function (err, row) {
        callback(err, row)
      })
  }

  updatePass (pass, id, callback) {
    return this.db.get(
      `UPDATE user SET user_pass = ? WHERE id = ?`,
      [pass, id], function (err, row) {
        callback(err, row)
      })
  }

  deleteAccount (id, callback) {
    return this.db.get(
      `DELETE FROM user WHERE id = ?`,
      [id], function (err, row) {
        callback(err, row)
      })
  }
}

module.exports = Db
