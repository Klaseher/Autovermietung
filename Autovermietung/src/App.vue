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
//oberhalb hmtl-code

//Main-Komponente Vue
//Sie wird überall auf jeder Seite angezeigt
import Auth from './services/auth.service'
//Der Aufbau einer Vue-Komponente ist prinzipiell immer gleich bei allen
//Daher hier kurz anhand dieser Komponente eine kurze Erklärung
export default {
  name: 'App', //Name Komponente
  data () { //Alle Variablen, die Komponente haben soll --> Quasi Konstruktor
    return {
      loggedIn: false,  //ermitteln, ob Person angemeldet
      login: 'Registrieren/Anmelden' //Textanzeige
    }
  },

methods: {  //Alle Methoden, die von der Komponente (wie bei einem Objekt) aufgerufen
            //werden können
            //können dann z.B. innerhalb der Komponente in <template></template> genutzt werden
  logout(){ //ausloggen
    Auth.logout()
  },
   changeValue () { //test, ob angemeldet durch Auslesen von Browser-Speicher
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

//spezielle Methode --> Wenn Pfad/URL geändert, wird Fkt. aufgerufen
watch: {
  //dient zum Ermitteln des Einloggstatus und ändert je nachdem
  //die Komponente (Anmelden --> Ihr Konto/ Es wird Ausloggen angezeigt)
    $route() {
        this.changeValue()
    }
},
}
//unterhalb css code
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
  padding: 20px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
