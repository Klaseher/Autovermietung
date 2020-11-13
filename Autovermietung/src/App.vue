<template>
<div id="app">
  <div id="nav">
    
    <router-link to="/">Home</router-link> |
    <router-link to="/about">HEYRJP</router-link> |
    <!-- <router-link to="/user">Login/Register</router-link> | -->
    <router-link to="/search">Unsere Autos</router-link> | 
    <router-link to="/login">{{login}}</router-link>
    <div v-if="loggedIn">
    <router-link @click="logout" to="/logout">Ausloggen</router-link>
    </div>
  </div>
  <router-view/>
</div>
</template>


<script>
import Auth from './services/auth.service'
export default {
  name: 'App',
  data () {
    return {
      loggedIn: false,
      login: 'Registrieren/Anmelden'
    }
  },

methods: {
  logout(){
    Auth.logout()
  },
   changeValue () {
      // eslint-disable-next-line eqeqeq
      if (sessionStorage.getItem('auth') == 'true') {
        this.login = 'Dein Account'
        this.loggedIn = true
      } else {
        this.login = 'Registrieren/Anmelden'
        this.loggedIn = false
      }
    }
},

watch: {
    $route() {
        this.changeValue()
    }
},
}
</script>

<style lang="scss">
#app {
  background:black;
  block-size: 5pc;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
