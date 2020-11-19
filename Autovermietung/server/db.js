//Hier erfolgt Bearbeitung DB mit SQL-Anfragen
//und genereller Zugriff auf diese
'use strict'
const sqlite3 = require('sqlite3').verbose()

class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
  }

  //Neuen Datensatz in User-Tabelle einfügen
  insert (user, callback) {
    return this.db.run(
      'INSERT INTO user (nachname, vorname, user, pass, adresse, telefon, rolle) VALUES (?,?,?,?,?,?,?)',
      user, (err) => {
        callback(err)
      })
  }

  
  //Token + Ablaufzeit zum Zurücksetzen PW für Kunden setzen
  updateReset (reset, callback) {
    return this.db.run(
      'UPDATE user SET resetToken = ?, ablaufdatum = ? WHERE id = ?',
      reset, (err) => {
        callback(err)
      })
  }

  //Person-Datensatz mit spezischem Username/Email aus DB holen
  selectByEmail (email, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE user = ?`,
      [email], function (err, row) {
        callback(err, row)
      })
  }

  //Person-Datensatz mit spezischer ID aus DB holen
  selectById (id, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE id = ?`,
      [id], function (err, row) {
        callback(err, row)
      })
  }

  
  //alle Mitarbeiter holen
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

  //Auto-Datensatz mit spezischem Namen aus DB holen
  getCar (name, callback) {
    return this.db.get(
      `SELECT * FROM auto WHERE name = ?`,
      [name], function (err, row) {
        callback(err, row)
      })
  }

  //Alle Datensätze aus Auto-Tabelle zurückgeben
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

  
  //Person-Nachname ändern
  updateName (name, id, callback) {
    return this.db.get(
      `UPDATE user SET nachname = ? WHERE id = ?`,
      [name, id], function (err, row) {
        callback(err, row)
      })
  }

  //Person-Mail/Username ändern
  updateMail (email, id, callback) {
    return this.db.get(
      `UPDATE user SET user = ? WHERE id = ?`,
      [email, id], function (err, row) {
        callback(err, row)
      })
  }

  //Person-Passwort ändern
  updatePass (pass, id, callback) {
    return this.db.get(
      `UPDATE user SET pass = ? WHERE id = ?`,
      [pass, id], function (err, row) {
        callback(err, row)
      })
  }

  //Person-Datensatz komplett aus DB löschen
  deleteAccount (id, callback) {
    return this.db.get(
      `DELETE FROM user WHERE id = ?`,
      [id], function (err, row) {
        callback(err, row)
      })
  }
}

module.exports = Db
