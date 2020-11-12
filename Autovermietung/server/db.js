'use strict'
const sqlite3 = require('sqlite3').verbose()

class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
  }

  insert (user, callback) {
    return this.db.run(
      'INSERT INTO user (nachname, vorname, user, pass, adresse, telefon, rolle) VALUES (?,?,?,?,?,?,?)',
      user, (err) => {
        callback(err)
      })
  }

  updateReset (reset, callback) {
    return this.db.run(
      'UPDATE user SET resetToken = ?, ablaufdatum = ? WHERE id = ?',
      reset, (err) => {
        callback(err)
      })
  }

  selectByEmail (email, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE user = ?`,
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
      `SELECT id, nachname, user FROM user WHERE rolle = ?`,
      ['1'], function (err, rows) {
        rows.forEach(function (row) {
          users.push(row)
        })
        callback(err, users)
      })
  }

  getAllCars (callback) {
    let cars = []
    return this.db.all(
      `SELECT * FROM auto`,
      function (err, rows) {
        rows.forEach(function (row) {
          cars.push(row)
        })
        callback(err, cars)
      })
  }


  updateName (name, id, callback) {
    return this.db.get(
      `UPDATE user SET nachname = ? WHERE id = ?`,
      [name, id], function (err, row) {
        callback(err, row)
      })
  }
  updateMail (email, id, callback) {
    return this.db.get(
      `UPDATE user SET user = ? WHERE id = ?`,
      [email, id], function (err, row) {
        callback(err, row)
      })
  }

  updatePass (pass, id, callback) {
    return this.db.get(
      `UPDATE user SET pass = ? WHERE id = ?`,
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
