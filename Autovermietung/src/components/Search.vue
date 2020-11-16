<template>
    <div >
        <h1>Unsere Autos</h1>
        <main class="search">
          <span>
              <input type="text" placeholder="Autoname" v-model="autoname" required autofocus/>
              <button type="submit" @click="searchCar()">
                    Autosuche
              </button>
          </span>
           <br />
            <br />
            <input type="text" placeholder="Startdatum" v-model="start" required autofocus/>
            <input type="text" placeholder="Enddatum" v-model="ende" required autofocus/>
            <br />
            <br />
            <br />
            <div v-on:click="seen = !seen">
            <button>
                Erweiterte Suche
            </button>
            <br />
            <div>
              <h2></h2>
            </div>
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
        <h3> Suchergebnisse </h3>
        
        <table v-for="auto in filtered_cars" :key="auto.name" id="auto">
          <h2>{{auto.name}}</h2>
          <article>
          <tr> 
            
            <!-- <td>{{auto.name}}</td> -->
          
            <td>Typ:</td>
            <td>{{auto.typ}}</td>
            <td>CO2:</td>
            <td>{{auto.co2}}</td>
          </tr>
          <tr>
            <td>Sitzplätze:</td>
            <td>{{auto.sitzplaetze}}</td>
            <td>Türen:</td>
            <td>{{auto.tueren}}</td>
          </tr>

          <tr>
            <td>Kraftstoff:</td>
            <td>{{auto.kraftstoff}}</td>
            
            <td>Leistung:</td>
            <td>{{auto.leistung}}</td>
            
          </tr>

          <tr>
            <td>Verbrauch:</td>
            <td>{{auto.verbrauch}}</td>
            
            <td>Tankvolumen:</td>
            <td>{{auto.tankvolumen}}</td>
          </tr>
          <tr>
            <td>Getriebe:</td>
            <td>{{auto.getriebe}}</td>
            <td>Preis:</td>
            <td>{{auto.preis}}</td>
          </tr>
          </article>
        </table>
        
        </main> 
    </div>
</template>

<script>
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
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
input{
  padding: 5px;
  width: fit-content;
}
button{
  padding: 10 10px;
}
</style>