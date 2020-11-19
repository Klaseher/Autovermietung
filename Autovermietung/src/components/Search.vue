<template>
    <div> 
        <h1>Unsere Autos</h1>
        <main class="search" v-if="!ausgewaehlt">
          <!-- Anzeige der Autos -->
            <h1> Suchergebnisse für: {{msg}}</h1>
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
              <!-- Inputs für Suchfkt. -->
                <input type="text" placeholder="Mindestpreis (€)" v-model="preis_min" required autofocus/>
                <input type="text" placeholder="Höchstpreis (€)" v-model="preis_max" required autofocus/>
                <input type="text" placeholder="Anzahl Sitze" v-model="platz" required autofocus/>
                <input type="text" placeholder="Anzahl Türen" v-model="tuer" required autofocus/>  
                <select v-model="typ">
                  <option value="" disabled selected>Autotyp (z.B. Kleinwagen)</option>
                  <option value="">Alle</option>
                  <option v-for="(typ,index) in autotypen" :key="index" :value="typ">{{typ}}</option>
                </select> 
                <select v-model="kraftstoff">
                  <option value="" disabled selected>Kraftstoff</option>
                  <option value="">Alle</option>
                  <option v-for="(kraftstoff,index) in kraftstofftypen" :key="index" :value="kraftstoff">{{kraftstoff}}</option>
                </select>
                <input type="text" placeholder="Co2-Ausstoß (g/km)" v-model="c02" required autofocus/>
                <input type="text" placeholder="Spritverbrauch (l/100km)" v-model="verbrauch" required autofocus/>
                <input type="text" placeholder="Tankvolumen (l)" v-model="tankvolumen" required autofocus/>
                <input type="text" placeholder="Leistung (PS)" v-model="leistung" required autofocus/>
                <select v-model="getriebe">
                <option value="" disabled selected>Getriebeart</option>
                <option value="">Alle</option>
                <option v-for="(getriebe,index) in getriebetypen" :key="index" :value="getriebe">{{getriebe}}</option>
                </select>
            </div>
          <h3> Suchergebnisse </h3>
            
          <!-- Ausgabe der Autodaten in Tabelle --> 
          <table v-for="auto in gesuchteAutos" :key="auto.name" id="auto">
            <h2>{{auto.name}}</h2>
            <article>
            <tr> 
              
              <!-- <td>{{auto.name}}</td> -->
            
              <td>Typ:</td>
              <td>{{auto.typ}}</td>
              <td>CO2:</td>
              <td>{{auto.co2}}</td>
              <td>Mieten:</td>
              <td><button type="submit" @click="mieten(auto.name)" :disabled="!verfuegbarkeit(auto.verfuegbar)">Mieten</button></td>
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
              <td>Modell:</td>
              <td>{{auto.modelbezeichnung}}</td>
            </tr>
            </article>
          </table>
        </main> 
        <!-- Wenn Auto ausgewählt zum Mieten, dann wird dies geladen -->
        <div v-else>
          <button type="cancel" @click="back">
                  Zurueck zur Suche
          </button>
          <h1>Auto: {{gewaehltesauto.name}}</h1>
          <h1>Preis/Tag: {{gewaehltesauto.preis}}</h1>
          <h1>Verbrauch: {{gewaehltesauto.verbrauch}}</h1>
          <button type="submit" @click="buchen()" :disabled="!verfuegbarkeit(gewaehltesauto.verfuegbar)">Jetzt {{gewaehltesauto.name}} verbindlich mieten</button>
        </div>
    </div>
</template>

<script>
//Komponente zum Suchen + Mieten Auto
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      msg:'Alle Autos',
      preis_min: '',
      preis_max: '',
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
      gewaehltesauto: "", //hier wird ausgewähltes Auto gespeichert
      autos: [],          //alle Autos von Backend
      gesuchteAutos: [],  //Autos, die Filter entsprechen
      kratstofftypen: [], //Arten von Kraftstoff
      autotypen: [],      //Typen von Autos
      getriebetypen: [],  //Typen von Autogetrieben
      seen: false,        
      ausgewaehlt : false //festlegen, ob Auto ausgewählt wurde

    }
  },
  methods: {
    //alle Autos von Backend holen, wenn noch nicht vorhanden
    ladeAutos(){
          if(this.autos.length < 1){
            UserService.getCar("alle")
            .then(response => {
              this.autos.push.apply(this.autos, response.data.cars)
              this.gesuchteAutos = this.autos
            })
            .catch((error) => Helper.handle(error)
            )}
    },
    //Autosuche + Filter
    searchCar () {
          this.ladeAutos()
          this.gesuchteAutos = this.autos.filter((auto) =>{
            let co2 = false
            let max = false
            let tuer = false
            let platz = false
            let verbrauch = false
            if(this.c02 == ''){co2 = true}
            else{co2 = (auto.co2 <= this.c02)}
            if(this.preis_max == ''){max = true}
            else(max = (auto.preis <= this.preis_max))
            if(this.tuer == ''){tuer = true}
            else(tuer = (auto.tueren == this.tuer))
            if(this.platz == ''){platz = true}
            else(platz = (auto.sitzplaetze == this.platz))
            if(this.verbrauch == ''){verbrauch = true}
            else{verbrauch = (auto.verbrauch <= this.verbrauch)}
            return (this.autoname.toLowerCase().split(' ').every(v => auto.name.toLowerCase().includes(v))) 
            && (tuer)
            && (platz)
            && (auto.typ.toLowerCase().match(this.typ.toLowerCase()))
            && (co2)
            && (verbrauch)
            && (auto.kraftstoff.toLowerCase().match(this.kraftstoff.toLowerCase()))
            && (auto.tankvolumen >= this.tankvolumen)
            && (auto.leistung >= this.leistung)
            && (auto.preis >= this.preis_min && max)
            && (auto.getriebe.toLowerCase().match(this.getriebe.toLowerCase()))
                     
      })
      if(this.autoname == ""){
        this.msg = 'Alle Autos'
      }
      else{
        this.msg = this.autoname
      }
    },
    //Auswählen eines Autos und detaillierte Anzeige aller Infos
    mieten (autoname) {
      this.ausgewaehlt = true
      this.gewaehltesauto = this.autos.find(element => element.name == autoname )
      this.$router.push('/search/' + autoname)
    },
    //Test, ob Auto gemietet werden kann
    verfuegbarkeit (vorhanden){
      if(vorhanden == 1){
        return true
      }
      else{
        return false
      }
    },

    //Buchung erstellen und an Backend senden
    buchen(){
        //request an backend, um buchung abzuschließen
        //dazu in db eine bestellung erstellt werden
        //employee kann es dann abrufen in account
    },
    back (){
     this.ausgewaehlt = false
     this.ladeAutos()
     this.$router.push('/search') 
    }
  },

  //Weitere spezielle Fkt. von Komponente
  //beforeMount() --> Wird automatisch ausgeführt, bevor Komponente geladen wird
   beforeMount () {
    this.kraftstofftypen = ["Super", "Super Plus", "Diesel"] //Auswahlmöglichkeiten Kraftstoffe
    this.autotypen = ["SUV", "Kleinwagen", "Van", "Coupe"] //Auswahlmöglichkeiten Autotypen
    this.getriebetypen = ["Automatik", "Schaltung"]    //Auswahlmöglichkeiten Getriebe
    //Test, ob Parameter in Route übergeben
    if (this.$route.params.autoname != '') {
      this.ausgewaehlt = true
      UserService.getCar(this.$route.params.autoname)
      .then(response => {
        this.gewaehltesauto = response.data.car
      })
       .catch((error) => {
            Helper.handle(error)
            this.ausgewaehlt = false
            this.msg = ''
            Helper.redirect('/search')
      })
    } else {
      this.ausgewaehlt = false
      this.ladeAutos()
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