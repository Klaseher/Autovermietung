<template>
    <div class="hello">
        <h1>Welcome to regular users page</h1>
        <h2>{{msg}}</h2>
        <div v-on:click="zeigeBestellungen()" class="control">
                <button>
                    Bestellungen
                </button>
        </div>

    </div>
</template>

<script>
//Komponente für Kunde
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      msg: 'The commoners'
    }
  },

  methods: {
    redirect (route) {
      Helper.redirect(route)
    },
     zeigeBestellungen(){
       this.$router.push('/dashboard/bestellungen')
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
