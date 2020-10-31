<template>
  <div id="app">
    <main>
      <div class ="search-box">

        <input type="text" class ="search-bar" placeholder="Suche"/>

      </div>

    </main>

      <router-link to="/login">{{login}}</router-link>
      <router-link to="/about">/About</router-link>

     <router-view/>

  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      login: 'Registrieren/Anmelden',
      loggedIn: false
    }
  },

  methods: {
    changeValue () {
      // eslint-disable-next-line eqeqeq
      if (sessionStorage.getItem('auth') == 'true') {
        this.login = 'Dein Account'
      } else {
        this.login = 'Registrieren/Anmelden'
      }
    }
  },
  beforeUpdate () {
    this.changeValue()
  }

}
</script>

<style >
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #app {
    font-family: Tahoma;
    font-size: 14px;
    color: #222;
    background-color: #EEEEEE;
    height: 100vh;
    display: flex;
    justify-content: top;
    align-items: top;

  }
  main{
    min-height: 100vh;
    padding: 25px;
  }
  .search-box{
    width: 100%;
    margin-bottom: 38px;
  }
  .search-box.search-bar {
    display: block;
    width: 100%;
    padding: 15px;
    color: bisque;
    font-size: 20px;
    appearance: none;
    border: none;
    outline: none;
    background: none;

  }
  .login{
    padding: 0;
    font-size: 14px;
  }
  #navigator a{
  padding: 30px;
  }
  #navigator a{
    font-weight: bold;
    color: blue;
  }
  #natigator a.router-link-exact-active{
    color: blue;
  }
</style>
