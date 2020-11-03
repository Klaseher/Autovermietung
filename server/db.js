// Hier kommen alle SQL-Anfragen und alle Funktionen für die Sqlite-Datenbank rein

const sqlite3 = require('sqlite3').verbose()

// Datenbank-Objekt erstelln durch Öffnen bestehender Datenbank
class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
  }
}

module.exports = Db
