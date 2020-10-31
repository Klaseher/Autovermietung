<template>
    <div class="hello">
      <div v-if="!loggedin">
        <button type="submit" @click="redirect('/login')">
                      Registrieren/Login
          </button>
        </div>
        <div v-else>
            <button type="submit" @click="logout()">
                    Logout
          </button>
          <button type="submit" @click="redirect('/login')">
                    {{login}}
          </button>
        </div>
        <h1>This is the super dope Homepage</h1>
        <h2>{{msg}}</h2>
    </div>
</template>

<script>
/* eslint-disable eqeqeq */
import Helper from '../services/helper.service'
import Auth from '../services/auth.service'
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to CarSharing XXXTREMEXXX',
      login: 'Login',
      loggedin: false
    }
  },
  methods: {
    redirect (route) {
      Helper.redirect(route)
    },
    logout () {
      Auth.logout()
      this.changeValue()
    },
    changeValue () {
      if (sessionStorage.getItem('auth') == 'true') {
        this.loggedin = true
        this.login = 'Your Account'
      } else {
        this.loggedin = false
        this.login = 'Login'
      }
    }
  },
  beforeMount () {
    this.changeValue()
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
