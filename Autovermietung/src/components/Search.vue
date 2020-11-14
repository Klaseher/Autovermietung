<template>
    <div >
        <h1> Suchergebnisse für: {{msg}}</h1>
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
        <h3> Ergebnisse </h3>
        <table v-for="auto in filtered_cars" :key="auto.name" id="auto">
          <tr> 
            <td>{{auto.name}}</td>
            <td>{{auto.verbrauch}}l/100km</td>
          </tr>
        </table>

    </div>
</template>

<script>
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
// import { computed } from 'vue'
export default {
  data () {
    return {
      msg:'Alle Autos',
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
   beforeMount () {
    UserService.getCars()
      .then(response => {
        this.autos.push.apply(this.autos, response.data.cars)
      })
      .catch((error) => Helper.handle(error))
  },

  computed:{
    filtered_cars:function(){
      return this.autos.filter((auto) =>{
        return auto.name.match(this.autoname);

      });
    }
  }

}
</script>


<style scoped>
h1{
    color: brown;
}

#auto {
  border: 20px salmon;
}
</style>