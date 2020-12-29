<template>
  <article>
    <div class="container" :class="{'sign-up-active' : signUp}">
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-left">
            <h2>Herzlich Willkommen!</h2>
            <p>Loggen Sie sich mit Ihren Benutzerdaten ein! </p>
            <button class="invert" id="signIn" @click="signUp = !signUp">Weiter</button>
          </div>
          <div class="overlay-right">
            <h2>Guten Tag!</h2>
            <p>Melden Sie sich an und genießen Sie unseren Service</p>
            <button class="invert" id="signUp" @click="signUp = !signUp">Registrieren</button>
          </div>
        </div>
      </div>
      <form class="sign-up">
        <h2>Neues Konto anlegen</h2>
        <div>Nutzen Sie Ihre Email zum Registrieren</div>

        <input type="text" placeholder="Vorname*" v-model="name" required autofocus/>
        <input type="text" placeholder="Name*" v-model="vorname" required autofocus/>
        <input type="email" placeholder="Email*" v-model="email" required autofocus/>
        <input type="text" placeholder="Adresse*" v-model="adresse" required autofocus/>
        <input type="tel" placeholder="Telefonnummer" v-model="telefon"/>
        <input type="password" placeholder="Password*" v-model="password" required/>
        <input type="password" placeholder="Password erneut eingeben" v-model="password_confirmation" required/>
        <button type="cancel" @click="back">Zurück</button>
        <br />
        <button type="submit" @click="register">
                    Bestätigen
        </button>
      </form>
      <form class="sign-in">
        <h2>Anmelden</h2>
        <div>Nutzen Sie Ihr Konto</div>
        <input type="email" placeholder="Email" v-model="email" required autofocus/>
        <input type="password" placeholder="Password" v-model="password" required/>
        <a href="/reset">Haben Sie Ihr Passwort vergessen?</a>
        <button type="submit" @click="login" :disabled="disabled">
                    Einloggen
        </button>
         <button type="cancel" @click="back" :disabled="disabled">
                    Zurueck
        </button>
      </form>
    </div>
  </article>
</template>


<script>
import Helper from '../services/helper.service'
import Auth from '../services/auth.service'
export default {
  data () {
    return {
      name: '',
      vorname: '',
      email: '',
      password: '',
      password_confirmation: '',
      adresse: '',
      telefon: '',
      is_admin: null,
      signUp: false,
      disabled: false
    }
  },
  methods: {

    back () {
      Helper.redirect('/')
    },
    //Registrierungsdaten prüfen, auswerten und Kunde in DB anlegen
    register (e) {
      e.preventDefault()
      var vornameTest = new RegExp('([a-zA-Z]{3,100}\\s*)+')
      var nameTest = new RegExp('[a-zA-Z]{3,100}')
      var passTest = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      var mail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
      var address = new RegExp("[A-Za-z0-9'\\.\\-\\s\\,]")
      var telTester = new RegExp('^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')
      if (this.name.length > 2 && this.name.length < 100 && nameTest.test(this.name) && this.vorname.length > 2 && this.vorname.length < 100 && vornameTest.test(this.vorname)) {
        if (mail.test(this.email) && this.email.length < 100) {
          if (address.test(this.adresse) && this.adresse.length < 100 && this.adresse.length > 0) {
            if ((this.telefon.length > 0 && telTester.test(this.telefon)) || this.telefon.length == 0) {
              if (this.password == this.password_confirmation) {
                if (passTest.test(this.password) && this.password.length > 5 && this.password.length < 100) {
                  Auth.register(this.name, this.vorname, this.email, this.password, this.adresse, this.telefon)
                    .then(response => {
                      alert(response.data)
                      this.$router.push('/')
                    })
                    .catch((error) => Helper.handle(error))
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
            } else {
              this.telefon = ''
              return alert('Telephone number is invalid')
            }
          } else {
            this.address = ''
            return alert('Invalid Address format')
          }
        } else {
          this.email = ''
          return alert('Invalid Email format')
        }
      } else {
        this.name = ''
        this.vorname = ''
        return alert('Name too long or short or contains invalid symbols')
      }
    },
    //Anmelden des Kunden --> Verifizierung Anmeldedaten gegenüber Backend
    //Identifizierung und Speicherung der Zugriffsrechte der Person
    login (e) {
      e.preventDefault()
      this.disabled = true
      /* Regex: Strong Password
      Special Characters - Not Allowed
      Spaces - Not Allowed
      Minimum and Maximum Length of field - 6 to 12 Characters
      Met by [a-zA-Z0-9@]{6,12}
      Numeric Character - At least one character
      Met by positive lookahead (?=.*\d)
      At least one Capital Letter
      Met by positive lookahead (?=.*[A-Z])
      Repetitive Characters - Allowed only two repetitive characters */
      var userTest = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$')
      // Regex Mail: Only email allowed something@something.something
      var mail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
      // Regex Medium Password
      var passTest = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      if (this.email.length > 6 && this.email.length < 100 && (userTest.test(this.email) || mail.test(this.email)) &&
                    passTest.test(this.password) && this.password.length > 0 && this.password.length < 100) {
        if (this.password.length > 0) {
          Auth.login(this.email, this.password)
            .then(response => {
              // eslint-disable-next-line camelcase
              let is_admin = response.data.role
              sessionStorage.setItem('role', JSON.stringify(response.data.role))
              sessionStorage.setItem('auth', response.data.auth)

              if (sessionStorage.getItem('auth') == 'true') {
                this.disabled = false
                if (this.$route.params.nextUrl != null) {
                  this.$router.push(this.$route.params.nextUrl)
                } else {
                  // eslint-disable-next-line camelcase
                  if (is_admin >= 1) {
                    this.$router.push('admin')
                  } else {
                    this.$router.push('dashboard')
                  }
                }
              }
            })
            .catch((error) => {
              this.password = ''
              Helper.handle(error)
              this.disabled = false
            })
        }
      } else {
        this.password = ''
        alert('Credentials invalid')
        this.disabled = false
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 768px;
    height: 480px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0, 0, 0, .2),
                0 10px 10px rgba(0, 0, 0, .2);
    background: linear-gradient(to bottom, #efefef, #ccc);
    .overlay-container {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      overflow: hidden;
      transition: transform .5s ease-in-out;
      z-index: 100;
    }
    .overlay {
      position: relative;
      left: -100%;
      height: 100%;
      width: 200%;
      background: linear-gradient(to bottom right, #256cd6, #020093);
      color: #fff;
      transform: translateX(0);
      transition: transform .5s ease-in-out;
    }
    @mixin overlays($property) {
      position: absolute;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      padding: 70px 40px;
      width: calc(50% - 80px);
      height: calc(100% - 140px);
      text-align: center;
      transform: translateX($property);
      transition: transform .5s ease-in-out;
    }
    .overlay-left {
      @include overlays(-20%);
    }
    .overlay-right {
      @include overlays(0);
      right: 0;
    }
  }
  h2 {
    margin: 0;
  }
  p {
    margin: 20px 0 30px;
  }
  a {
    color: #222;
    text-decoration: none;
    margin: 15px 0;
    font-size: 1rem;
  }
  button {
   border-radius: 20px;
    border: 1px solid #009345;
    background-color: #009345;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    padding: 10px 40px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform .1s ease-in;
    &:active {
      transform: scale(.9);
    }
    &:focus {
      outline: none;
    }
  }
  button.invert {
    background-color: transparent;
    border-color: #fff;
  }
  form {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 90px 60px;
    width: calc(50% - 120px);
    height: calc(100% - 180px);
    text-align: center;
    background: linear-gradient(to bottom, #efefef, #ccc);
    transition: all .5s ease-in-out;
    div {
      font-size: 1rem;
    }
    input {
      background-color: #eee;
      border: none;
      padding: 8px 15px;
      margin: 6px 0;
      width: calc(100% - 30px);
      align-content: center;
      border-radius: 15px;
      border-bottom: 1px solid #ddd;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, .4), 
                        0 -1px 1px #fff, 
                        0 1px 0 #fff;
      overflow: hidden;
      &:focus {
      outline: none;
      background-color: #fff;
      }
    }
  }
  .sign-in {
    left: 0;
    z-index: 2;
  }
  .sign-up {
    left: 0;
    z-index: 1;
    opacity: 0;
  }
  .sign-up-active {
    .sign-in {
      transform: translateX(100%);
    }
    .sign-up {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: show .5s;
    }
    .overlay-container {
      transform: translateX(-100%);
    }
    .overlay {
      transform: translateX(50%);
    }
    .overlay-left {
      transform: translateX(0);
    }
    .overlay-right {
      transform: translateX(20%);
    }
  }
  @keyframes show {
    0% {
      opacity: 0;
      z-index: 1;
    }
    49% {
      opacity: 0;
      z-index: 1;
    }
    50% {
      opacity: 1;
      z-index: 10;
    }
  }
</style>
  