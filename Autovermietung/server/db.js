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
  getCar (name, callback) {
    return this.db.get(
      `SELECT * FROM auto WHERE name = ?`,
      [name], function (err, row) {
        callback(err, row)
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

  //Alle Bestellzeitraeume von einem spezifischen Auto
  getCarTimeframes (autoname, callback) {
    let timeframes = []
    return this.db.all(
      `SELECT startdatum, enddatum FROM bestellung WHERE auto_fk = ? AND status <> 3 AND status <> 4`,
      [autoname], function (err, rows) {
        rows.forEach(function (row) {
          timeframes.push(row)
        })
        callback(err, timeframes)
      })
  }

  //Alle Bestellzeitraeume von allen Autos
  getAllTimeframes (callback) {
    let timeframes = []
    return this.db.all(
      `SELECT auto_fk, startdatum, enddatum FROM bestellung`,
      function (err, rows) {
        rows.forEach(function (row) {
          timeframes.push(row)
        })
        callback(err, timeframes)
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

  //Bestellungen Status
  //0 --> vom Kunden erstellte Bestellung
  //1 --> vom Mitarbeiter akzeptierte (damit aktive) Bestellung
  //2 --> bestellung vom kunden aus abgebrochen --> von mitarbeiter noch zu bearbeiten
  //3 --> abgebrochene abgeschlossene bestellung kunde z.B. wenn mitarbeiter bestellung abbricht oder kunde
  // falls keine offenen probleme vorhanden sind  (2 wird zu 3, wenn mitarbeiter bestellung begutachtet hat)
  //4 --> erfolgreich abgeschlossene Bestellung (nachdem Kunde Auto zurückgegeben hat)


  //Bestellung Kunde erstellen
  createOrder (order, callback) {
    return this.db.run(
      'INSERT INTO bestellung (user_fk, auto_fk, startdatum, enddatum, status, zeitstempel) VALUES (?,?,?,?,?,?)',
      order, (err) => {
        callback(err)
      })
  }

  //Bestellung Kunde erhalten mit BNR
  getCustomerOrderbyBnr (id, bnr, callback) {
     return this.db.get(
      `SELECT * FROM bestellung WHERE user_fk = ? AND bnr = ?`,
      [id, bnr], function (err, row) {
        callback(err, row)
      })
  }

  //Alle Bestellungen Kunde erhalten, die offen sind
  getCustomerOrders (id, callback) {
    let orders = []
    return this.db.all(
      `SELECT * FROM bestellung WHERE user_fk = ? AND status <> 3 AND status <> 4`,
      [id], function (err, rows) {
        rows.forEach(function (row) {
          orders.push(row)
        })
        callback(err, orders)
      })
  }

  //Bestellung erhalten mit Bnr
  getOrderbyBnr (bnr, callback) {
     return this.db.get(
      `SELECT bnr, auto_fk, startdatum, enddatum, status, zeitstempel, vorname, nachname, user, adresse, telefon FROM bestellung JOIN user ON bestellung.user_fk=user.id WHERE bnr = ?`,
      bnr, function (err, row) {
        callback(err, row)
      })
  }

  //Alle offenen Bestellungen Kunde erhalten
  getAllOpenOrders (callback) {
    let orders = []
    return this.db.all(
      `SELECT bnr, auto_fk, startdatum, enddatum, status, zeitstempel, vorname, nachname, user, adresse, telefon FROM bestellung JOIN user ON bestellung.user_fk=user.id WHERE status <> 3 AND status <> 4`,
      function (err, rows) {
        rows.forEach(function (row) {
          orders.push(row)
        })
        callback(err, orders)
      })
  }

}

module.exports = Db
