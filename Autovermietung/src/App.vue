<template>
<div id="app">
  <div id="nav">
    
    <router-link to="/">Home</router-link> |
    <router-link to="/about">HEYRJP</router-link> |
    <!-- <router-link to="/user">Login/Register</router-link> | -->
    <router-link to="/catalog">Unsere Autos</router-link> |
    <router-link to="/acc">Konto</router-link> |   
    <router-link to="/user">{{login}}</router-link>
  </div>
  <router-view/>
</div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      autoname: '' ,
      login: 'Registrieren/Anmelden'
      
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
