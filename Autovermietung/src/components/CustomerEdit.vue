<template>
  <div class="container">
    <h1>Kundendaten bearbeiten</h1>
    <hr>

    <div class="form-group">
      <form>
        <div class="form-group">
          <label for="name"><b>Aktueller Name: </b> {{ name }}</label>
        </div>
        <div  class="form-inline">
          <div class="form-group">
            <input class="form-control" id="name" type="text" v-model="new_name" required autofocus>
          </div>
          <div class="form-group mx-sm-3">
            <button class="btn btn-primary" type="button" @click="updateName">
              Name ändern
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="form-group" v-if="rolle == 0">
      <form>
        <div class="form-group">
          <label for="name"><b>Adresse: </b> {{ adresse}}</label>
        </div>
        <div  class="form-inline">
          <div class="form-group">
            <input class="form-control" id="adresse" type="text" v-model="new_adresse" required autofocus>
          </div>
          <div class="form-group mx-sm-3">
            <button class="btn btn-primary" type="button" @click="updateAdresse">
              Adresse ändern
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="form-group" v-if="rolle == 0">
      <form>
        <div class="form-group">
          <label for="name"><b>Telefon: </b> {{ telefon}}</label>
        </div>
        <div  class="form-inline">
          <div class="form-group">
            <input class="form-control" id="telefon" type="text" v-model="new_telefon" required autofocus>
          </div>
          <div class="form-group mx-sm-3">
            <button class="btn btn-primary" type="button" @click="updateTelefon">
              Telefon ändern
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="form-group">
      <form >
        <div class="form-group">
          <label for="username">Aktueller Benutzername: {{ username }} </label>
        </div>
        <div class="form-inline">
        <div class="form-group">
          <input class="form-control" id="username" type="email" v-model="new_username" required autofocus>
        </div>
        <div class="form-group mx-sm-3">
          <button type="button" @click="updateUsername" class="btn btn-primary">
            Benutzername ändern
          </button>
        </div>
        </div>
      </form>
    </div>
    <div class="form-group">
      <form>
        <div class="form-group">
          <label for="password">Neues Passwort</label>
          <input class="form-control" id="password" type="password" v-model="password" required>
        </div>
        <div class="form-group">
          <label for="password">Passwort bestätigen</label>
          <input class="form-control" id="new_password" type="password" v-model="new_password" required>
        </div>
        <div class="form-group">
          <button class="btn btn-primary" type="button" @click="changePassword">
            Passwort ändern
          </button>
        </div>
      </form>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" type="cancel" @click="back">
        Zurück
      </button>
      <button class="btn btn-danger" type="button" @click="deleteEmployee">
        Kundenkonto entfernen
      </button>
    </div>
    <h2 class="text-center">{{ meldung }}</h2>
  </div>
</template>

<script>
//Komponente zum Bearbeiten von Mitarbeiter-Konto durch Admin
import UserService from '../services/user.service'
import Auth from '../services/auth.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      meldung: '',
      name: '',
      username: '',
      password: '',
      id: -1,
      new_name: '',
      new_username: '',
      new_password: '',
      adresse: '',
      new_adresse: '',
      telefon: '',
      new_telefon: '',
      rolle: '',
    }
  },
  methods: {
    back () {
      this.$router.push('/admin/customers');
    },
    //Methoden zum Ändern der jeweiligen Attribute von Mitarbeiter
    updateName () {
      var nameTest = new RegExp("^[a-zA-Z]+(([', ][a-zA-Z ])?[a-zA-Z]*)*$")
      if (this.new_name.length > 2 && this.new_name.length < 100 && this.new_name != this.name && nameTest.test(this.new_name)) {
        Auth.updateEmployee(this.id, this.new_name, null, null)
          .then(response => {
            this.meldung = 'Kundennachname erfolgreich geändert'
            this.name = response.data.name
            this.new_name = ''
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/admin/customers')
          })
      } else {
        this.new_name = ''
        return alert('Name invalid')
      }
    },
    updateAdresse() {
      var adresseTest = new RegExp("[A-Za-z0-9'\\.\\-\\s\\,]")
      if (this.new_adresse.length > 5 && this.new_adresse.length < 100 && this.new_adresse != this.adresse && adresseTest.test(this.new_adresse)) {
        Auth.updateEmployee(this.id, null, null, null, this.new_adresse)
            .then(response => {
              this.meldung = 'Kundenadresse erfolgreich geändert'
              this.adresse = response.data.adresse
              this.new_adresse = ''
            })
            .catch((error) => {
              Helper.handle(error)
              Helper.redirect('/admin/customers')
            })
      } else {
        this.new_adresse = ''
        return alert('adresse invalid')
      }
    },
    updateTelefon () {
      var telefonTest =new RegExp('^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')
      if (this.new_telefon.length > 5 && this.new_telefon.length < 100 && this.new_telefon != this.telefon && telefonTest.test(this.new_telefon)) {
        Auth.updateEmployee(this.id, null, null, null,null, this.new_telefon)
            .then(response => {
              this.meldung = 'Kundentelefon erfolgreich geändert'
              this.telefon = response.data.telefon
              this.new_telefon = ''
            })
            .catch((error) => {
              Helper.handle(error)
              Helper.redirect('/admin/customers')
            })
      } else {
        this.new_telefon = ''
        return alert('telefon invalid')
      }
    },
    updateUsername () {
      var userTest = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$')
      if (this.new_username.length > 5 && this.new_username.length < 100 && this.new_username != this.username && userTest.test(this.new_username)) {
        Auth.updateEmployee(this.id, null, this.new_username, null)
          .then(response => {
            this.meldung = 'Kunden Benutzername erfolgreich geändert'
            this.username = response.data.username
            this.new_username = ''
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/admin/customers')
          })
      } else {
        this.new_username = ''
        return alert('Username invalid')
      }
    },
    changePassword () {
      var passTest = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      if (this.password == this.new_password) {
        if (passTest.test(this.new_password) && this.new_password.length > 0 && this.new_password.length < 100) {
          Auth.updateEmployee(this.id, null, null, this.new_password)
            .then(response => {
              if(response)

              this.meldung = 'Kundenpasswort erfolgreich geändert'
              this.password = ''
              this.new_password = ''
            })
            .catch((error) => {
              Helper.handle(error)
              Helper.redirect('/admin/customers')
            })
        } else {
          this.password = ''
          this.new_password = ''
          return alert('Das eingegebene Passwort ist nicht Sicher genug')
        }
      } else {
        this.password = ''
        this.new_password = ''

        return alert('Passwörter stimmen nicht überein')
      }
    },
    //Methode zum Löschen von Mitarbeiter-Account
    deleteEmployee () {
      if (confirm('Möchten Sie wirklich dieses Kundenkonto löschen?')) {
        Auth.deleteEmployee(this.id)
          .then(response => {
            if(response)
            
            alert('Kundenkonto erfolgreich gelöscht')
            Helper.redirect('/admin/customers')
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/admin/customers')
          })
      } else {
        this.meldung = ''
      }
    }
  },
  beforeMount () {
    if (this.$route.params.id != null) {
      UserService.getEmployee(this.$route.params.id)
        .then(response => {
          this.id = response.data.employee.id
          this.name = response.data.employee.name
          this.username = response.data.employee.email
          this.adresse = response.data.employee.adresse;
          this.rolle = response.data.employee.rolle;
          this.telefon = response.data.employee.telefon;
        })
        .catch((error) => {
          Helper.handle(error)
          Helper.redirect('/admin/customers')
        })
    } else {
      Helper.redirect('/admin/customers')
    }
  }
}
</script>
<style  scoped>

</style>
