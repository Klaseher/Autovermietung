<template>
    <div>
        <h4>Login</h4>
        <form>
            <label for="email">E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="password" >Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                 <button type="cancel" @click="back">
                    Go back
                </button>
                 <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
        <h3 style="color:#FF0000">{{msg}}</h3>
    </div>
</template>

<script>
/* eslint-disable eqeqeq */
import Helper from '../services/helper.service'
import Auth from '../services/auth.service'
export default {
  data () {
    return {
      email: '',
      password: '',
      msg: ''
    }
  },
  methods: {

    back () {
      this.$router.push('/')
    },
    handleSubmit (e) {
      e.preventDefault()
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
                this.$emit('loggedIn')
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
            .catch((error) => Helper.handle(error))
        }
      } else {
        this.password = ''
        this.email = ''
        alert('Credentials invalid')
      }
    }

  }
}
</script>
