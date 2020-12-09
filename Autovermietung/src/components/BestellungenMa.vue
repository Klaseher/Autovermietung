<template>
    <div>
        <div v-if="!ausgewaehlt">
            <h1>{{msg}}</h1>
            <table>
                <thead>
                    <tr>
                        <th>BNR</th>
                        <th>Startdatum</th>
                        <th>Enddatum</th>
                        <th>Auto</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Erstelldatum</th>
                        <th>Status</th>
                        <th>Bearbeiten</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(bestellung, index) in bestellungen" :key="index" :class="getClass(bestellung.doppelt)">
                        <td>{{bestellung.bnr}}</td>
                        <td>{{bestellung.startdatum}}</td>
                        <td>{{bestellung.enddatum}}</td>
                        <td>{{bestellung.auto_fk}}</td>
                        <td>{{bestellung.vorname}}</td>
                        <td>{{bestellung.nachname}}</td>
                        <td>{{bestellung.zeitstempel}}</td>
                        <td>{{status(bestellung.status)}}</td>
                        <td><button @click="editingOrder(bestellung.bnr)">Weiter</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h1>{{msg}}</h1>
            <br /> <h3>Auto: {{gewaehlteBestellung.auto_fk}}</h3>
            <br /> <h3>Kunde: {{gewaehlteBestellung.vorname}} {{gewaehlteBestellung.nachname}}</h3>
            <br /> <h3>Email: {{gewaehlteBestellung.user}}</h3>
            <br /> <h3>Adresse: {{gewaehlteBestellung.adresse}}</h3>
            <br /> <h3>Telefon: {{gewaehlteBestellung.telefon}}</h3>
            <br /> <h3>Mietzeitraum: {{gewaehlteBestellung.startdatum}} - {{gewaehlteBestellung.enddatum}}</h3>
            <button type="cancel" @click="back">Zurueck zur Suche</button>
         </div>
    </div>
</template>


<script>
// Hier wird fuer Mitarbeiter/Admin alles bzgl. Bestellungen angezeigt/definiert
import UserService from "../services/user.service";
import Helper from "../services/helper.service";
export default {
    data(){
        return{
            ausgewaehlt: false,
            msg: '',
            bestellungen: [],
            gewaehlteBestellung: '',
            class: ''
        }
    },
    methods: {
        // zurueck zur allgemeinen Bestellueubersicht
        back() {
            this.ausgewaehlt = false;
            this.msg = "Alle Bestellungen"
            this.holeBestellungen();
            this.$router.push("/admin/bestellungen")
        },
        // test, ob bestellungen mehrfach vorhanden sind
        testdoppelt(){
             let verglichen = []
             for(let i=0; i < this.bestellungen.length-1; i++){
                let value = false
                for(let j=0; j < verglichen.length; j++){
                    if( verglichen[j].auto_fk == this.bestellungen[i].auto_fk){
                        value = true
                        break
                    }
                }
                if(value){
                    continue
                }
                verglichen.push(this.bestellungen[i]) 
                if(this.bestellungen[i].status != 3 && this.bestellungen[i].status != 4){
                        for(let h=i+1; h < this.bestellungen.length; h++){
                            if(this.bestellungen[i].auto_fk == this.bestellungen[h].auto_fk){
                                verglichen.push(this.bestellungen[h])
                                let startdatum = new Date(this.bestellungen[i].startdatum)
                                let enddatum = new Date(this.bestellungen[i].enddatum)
                                let von = new Date(this.bestellungen[h].startdatum)
                                let bis = new Date(this.bestellungen[h].enddatum)
                                if((enddatum.getTime() >= von.getTime()) || (enddatum.getTime() >= bis.getTime())){
                                    this.bestellungen[i].doppelt = true
                                    this.bestellungen[h].doppelt = true
                                }
                                else if((startdatum.getTime() <= von.getTime()) || (startdatum.getTime() <= bis.getTime())){
                                    this.bestellungen[i].doppelt = true
                                    this.bestellungen[h].doppelt = true
                                }
                                else if(((startdatum.getTime() <= von.getTime()) && (enddatum.getTime() >= von.getTime())
                                    ||((startdatum.getTime() <= bis.getTime()) && (enddatum.getTime() >= bis.getTime()))
                                    ||((startdatum.getTime() >= von.getTime()) && (enddatum.getTime() <= bis.getTime())))){
                                    this.bestellungen[i].doppelt = true
                                    this.bestellungen[h].doppelt = true
                                }
                            }
                        }
                }else{
                    continue
                }
            }
        },
        // faerbe tabelle, wenn doppelte bestellung
        getClass(doppelt) {
              if (doppelt) {
                this.class="doppelt"
                return this.class
              }
              else {
                this.class = "normal"
                return this.class
              }
        },
        // zur detaillierten Bestellübersicht wechseln
        editingOrder(bnr){
            this.ausgewaehlt = true;
            this.msg = "Bestellung: " + bnr
            this.gewaehlteBestellung = this.bestellungen.find(
            (element) => element.bnr == bnr)
            this.$router.push("/admin/bestellungen/" + bnr)
        },
        // alle bestellungen von backend holen
        holeBestellungen(){
            if (this.bestellungen.length < 1) {
                UserService.getOrder("alle")
                .then((response) => {
                    response.data.orders.forEach((order) => {
                        order.doppelt = false
                        this.bestellungen.push(order)
                    })
                    this.testdoppelt()
                })
                .catch((error) => Helper.handle(error));
            }
        },
         // status in text umwandeln
          status(status) {
           if(status == 0){
              return 'Wartet auf Bestaetigung'
           }
           else if(status == 1){
               return 'Laufende Bestellung'
           }
           else if(status == 2){
               return 'Wartet auf Ueberpruefung'
           }
           else if(status == 3){
               return 'Abgebrochene Bestellung'
           }
           else if(status == 4){
               return 'Erfolgreich abgeschlossene Bestellung'
           }
        }   
    },
    beforeMount(){
        if (this.$route.params.bnr != "") {
            this.ausgewaehlt = true
            this.msg = "Bestellung: " + this.$route.params.bnr
            UserService.getOrder(this.$route.params.bnr)
                .then((response) => {
                    response.data.order.doppelt = false
                    this.gewaehlteBestellung = response.data.order
                })
                .catch((error) => {
                    Helper.handle(error);
                    this.ausgewaehlt = false;
                    this.msg = ""
                    Helper.redirect("/admin/bestellungen")
                })
        }
        else{
            this.ausgewaehlt = false
            this.msg = "Alle Bestellungen"
            this.holeBestellungen()
        }
    }
}
 
</script>

<style scoped>
p{
    color:white;
    text-align: center;
    font-size: small;
}

.doppelt{
    background-color: red
}
.normal {
    background-color: white
}
</style>
