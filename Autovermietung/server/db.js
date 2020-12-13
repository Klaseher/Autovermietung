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
      `SELECT startdatum, enddatum FROM bestellung WHERE auto_fk = ? AND status NOT IN (2,3,4)`,
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
      `SELECT auto_fk, startdatum, enddatum FROM bestellung WHERE status NOT IN (2,3,4)`,
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
  //2 --> bestellung vom kunden aus abgebrochen --> zahlung ausstehend, d.h. auto wird freigegeben, aber bestellung ist noch nicht abgeschlossen
  //3 --> abgebrochene abgeschlossene bestellung kunde z.B. wenn mitarbeiter bestellung abbricht oder kunde
  // falls keine offenen probleme vorhanden sind  (2 wird zu 3, wenn mitarbeiter bestellung begutachtet hat)
  //4 --> erfolgreich abgeschlossene Bestellung (nachdem Kunde Auto zurückgegeben hat)
  //5 --> verspaetete bestellung, wo auto bereits ausgeliehen ist


  //Bestellung Kunde erstellen
  createOrder (order, callback) {
    return this.db.run(
      'INSERT INTO bestellung (user_fk, auto_fk, startdatum, enddatum, status, zeitstempel) VALUES (?,?,?,?,?,?)',
      order, function (err) {
        callback(err, this.lastID)
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

   //Bestellung testen, ob bnr u. autoname hat
   getOrderbyBnrAndCar (bnr, autoname, callback) {
    return this.db.get(
     `SELECT * from bestellung WHERE bnr = ? AND auto_fk = ?`,
     [bnr,autoname], function (err, row) {
       callback(err, row)
     })
 }

  //Alle offenen Bestellungen Kunde erhalten (0, also die noch zu bestaetigen sind), wenn mitarbeiter zuerst bestellungen anzeigt
  getAllOpenOrders (callback) {
    let orders = []
    return this.db.all(
      `SELECT bnr, auto_fk, startdatum, enddatum, status, zeitstempel, vorname, nachname, user, adresse, telefon FROM bestellung JOIN user ON bestellung.user_fk=user.id WHERE status = 0`,
      function (err, rows) {
        rows.forEach(function (row) {
          orders.push(row)
        })
        callback(err, orders)
      })
  }

  //Bestellungsstatus aendern
  updateStatusOrder(bnr,status,callback){
    return this.db.get(
      `UPDATE bestellung SET status = ? WHERE bnr = ?`,
      [status, bnr], function (err, row) {
        callback(err, row)
      })
  }

  //Kosten Typen
  //0 --> Standardkosten fuer Bestellung
  //1 --> Zusatzkosten Tank 
  //2 --> Zusatzkosten Sauberkeit
  //3 --> Zusatzkosten Verspaetung bei Abgabe
  //4 --> Zusatzkosten Schaeden
  //5 --> Zusatzkosten Abbruch Kunde Bestellung zu spaet (strafzahlung)

  addCost (standard, callback) {
    return this.db.run(
      'INSERT INTO kosten (bnr_fk, pos, menge, typ, beschreibung) VALUES (?,?,?,?,?)',
      standard, function (err) {
        callback(err)
      })
  }
   //Alle offenen Bestellungen Kunde erhalten
   getOrderCost (bnr, callback) {
    let costs = []
    return this.db.all(
      `SELECT menge, pos, typ, beschreibung, user_fk FROM kosten JOIN bestellung ON kosten.bnr_fk=bestellung.bnr WHERE bnr_fk = ?`,
      [bnr], function (err, rows) {
        rows.forEach(function (row) {
          costs.push(row)
        })
        callback(err, costs)
      })
  }

  addOrderCost (cost, callback) {
    return this.db.run(
      'INSERT INTO kosten (bnr_fk, pos, menge, typ, beschreibung) VALUES (?,?,?,?,?)',
      cost, (err) => {
        callback(err)
      })
  }

  //schaeden-tabelle stellt log fuer alle jemals aufgetretenen probleme auto dar
  // prioritaet:
  // -1 bei schaeden bedeutet behandelter Schaden (z.B. wenn Auto repariert wurde)
  // 0 --> fatal, d.h. auto kann nicht ausgeliehen werden, bis behoben
  // > 0 --> autoschaeden/probleme sind vorhanden, aber verhindern ausleihe auto nicht (z.b. kleiner autokratzer)
  getOpenCarDamage (auto, callback) {
    let damage = []
    return this.db.all(
      `SELECT * FROM schaden WHERE auto_fk = ? AND prioritaet >= 0`,
      [auto], function (err, rows) {
        rows.forEach(function (row) {
          damage.push(row)
        })
        callback(err, damage)
      })
  }

  //schaden hinzufuegen
  createDamage (damage, callback) {
    return this.db.run(
      'INSERT INTO schaden (auto_fk, pos, beschreibung, prioritaet, typ, hoehe) VALUES (?,?,?,?,?,?)',
      damage, (err) => {
        callback(err)
      })
  }

    //schaden hinzufuegen
    updatePriority (update, callback) {
      return this.db.run(
        `UPDATE schaden SET prioritaet = ? WHERE auto_fk = ? AND pos = ?`,
        update, (err) => {
          callback(err)
        })
    }


}

module.exports = Db
