<template>
    <div >
        <h1> Suchergebnisse für: {{updateSearch}}</h1>
        <input type="text" placeholder="Autoname" v-model="autoname" required autofocus/>
        <input type="text" placeholder="Startdatum" v-model="start" required autofocus/>
        <input type="text" placeholder="Enddatum" v-model="ende" required autofocus/>
        <button type="submit" @click="searchCar()">
                    Autosuche
        </button>
        <div v-on:click="seen = !seen">
            <button>
                Erweiterte Suche
            </button>
        </div>
        <div v-if="seen">
            <input type="text" placeholder="Preis (€)" v-model="preis" required autofocus/>
            <input type="text" placeholder="Anzahl Sitze" v-model="platz" required autofocus/>
            <input type="text" placeholder="Anzahl Türen" v-model="tuer" required autofocus/>
            <input type="text" placeholder="Autotyp (z.B. Kleinwagen)" v-model="typ" required autofocus/>
            <input type="text" placeholder="Co2-Ausstoß (g/km)" v-model="c02" required autofocus/>
            <input type="text" placeholder="Spritverbrauch (l/100km)" v-model="verbrauch" required autofocus/>
            <input type="text" placeholder="Kraftstoff" v-model="kraftstoff" required autofocus/>
            <input type="text" placeholder="Tankvolumen (l)" v-model="tankvolumen" required autofocus/>
            <input type="text" placeholder="Leistung (PS)" v-model="leistung" required autofocus/>
            <input type="text" placeholder="Getriebeart" v-model="getriebe" required autofocus/>

        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      preis: '',
      autoname: '',
      start: '',
      ende: '',
      platz: '',
      tuer: '',
      typ: '',
      c02: '',
      verbrauch: '',
      kraftstoff: '',
      tankvolumen: '',
      leistung: '',
      getriebe: '',
      autos: [],
      seen: false

    }
  },
  methods: {
    searchCar () {

    }

  },
  computed: {
    updateSearch () {
      let autoname = this.$route.params.autoname
      if (autoname == null) {
        autoname = 'Alle Autos'
      }
      return autoname
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
