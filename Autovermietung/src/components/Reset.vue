<template>
    <div v-if="!resetPW">
        <h1>Geben Sie die Email ein, die mit dem Account verknüpft ist, dessen Passwort Sie zurücksetzen möchten</h1>
        <form>
         <input type="email" placeholder="Email" v-model="email" required autofocus/>
         <button type="cancel" @click="back">
                    Zurueck
         </button>
         <button type="button" @click="reset">
                    Reset
         </button>
        </form>
        <h1>{{msg}}</h1>
    </div>
    <div v-else>
      <h1> Geben Sie hier Ihr neues Passwort ein </h1>
      <input type="password" placeholder="Ihr Neues Passwort" v-model="password" required autofocus/>
      <input type="password" placeholder="Bestätigen Sie Passwort" v-model="password_confirmation" required autofocus/>
         <button type="cancel" @click="back">
                    Abbrechen
         </button>
         <button type="button" @click="confirmNewPW">
                    Passwort ändern
         </button>
    </div>
</template>

<script>
//Komponente zum Zurücksetzen Passwort Kunde
import Helper from '../services/helper.service'
import Auth from '../services/auth.service'
export default {
  data () {
    return {
      msg: '',
      email: '',
      resetPW: false,
      password: '',
      password_confirmation: ''

    }
  },
  methods: {
    back () {
      Helper.redirect('/')
    },
    //Rücksetz-Anfrage von Kundenpasswort an Backend gesendet
    reset () {
      this.resetPW = false

      let mail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
      if (mail.test(this.email) && this.email.length < 100) {
        Auth.resetUserPW(this.email)
          .then(response => {
            if(response.data.success){
              this.msg = 'Wenn ein Account mit dieser Email vorhanden ist, erhalten Sie darüber eine Nachricht mit Anweisungen zum Zurücksetzen Ihres Passwortes'
              this.email = ''
            }
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/')
          })
      } else {
        this.email = ''
        this.msg = 'Invalid Email format'
      }
    },
    //Verifizierung neues Passwort von Kunden durch Backend
    confirmNewPW () {
      let passTest = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      if (this.password == this.password_confirmation) {
        if (passTest.test(this.password) && this.password.length > 5 && this.password.length < 100) {
          Auth.resetUserPWConfirmation(this.$route.params.id, this.$route.params.token, this.password)
            .then(response => {
              if(response.data.success){
              alert('Das Passwort wurde erfolgreich zurückgesetzt')
              Helper.redirect('/login')
              }
            })
            .catch((error) => {
              Helper.handle(error)
              Helper.redirect('/')
            })
        } else {
          this.password = ''
          this.password_confirmation = ''

          return alert('Password is not safe enough')
        }
      } else {
        this.password = ''
        this.password_confirmation = ''

        return alert('Passwords do not match')
      }
    }
  },
  beforeMount () {
    if (this.$route.params.id != '' && this.$route.params.token != '') {
      this.resetPW = true
    } else {
      this.resetPW = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
