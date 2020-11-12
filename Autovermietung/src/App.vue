<template>
<div id="app">
  <div id="nav">
    
    <router-link @click="update" to="/">Home</router-link> |
    <router-link @click="update" to="/about">HEYRJP</router-link> |
    <!-- <router-link to="/user">Login/Register</router-link> | -->
    <router-link @click="update" to="/search">Unsere Autos</router-link> | 
    <router-link @click="update" to="/login">{{changeValue}}</router-link>
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
      loggedIn: false
    }
  },

methods: {
  updateLogin(value) {
      this.loggedIn = value
  },
  logout(){
    Auth.logout()
    this.update()
  },
  update(){
     this.$forceUpdate()
  }
},

 computed: {
       changeValue () {
        let login = ''  
        if (sessionStorage.getItem('auth') == 'true') {
          login = 'Dein Account'
           this.updateLogin(true)
        } else {
          login = 'Registrieren/Anmelden'
          this.updateLogin(false)
        }
        return login
    }
 }
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
