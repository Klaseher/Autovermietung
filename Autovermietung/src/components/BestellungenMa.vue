<template>
    <div>
        <div v-if="!ausgewaehlt">
            {{msg}}
            <table>
                <thead>
                    <tr>
                        <th>BNR</th>
                        <th>Startdatum</th>
                        <th>Enddatum</th>
                        <th>Auto</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Bearbeiten</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(bestellung, index) in bestellungen" :key="index">
                        <td>{{bestellung.bnr}}</td>
                        <td>{{bestellung.startdatum}}</td>
                        <td>{{bestellung.enddatum}}</td>
                        <td>{{bestellung.auto}}</td>
                        <td>{{bestellung.vorname}}</td>
                        <td>{{bestellung.nachname}}</td>
                        <td><button @click="editingOrder(bestellung.bnr)">Weiter</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            {{msg}}
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
            gewaehlteBestellung: ''
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
        // zur detaillierten Bestellübersicht wechseln
        editingOrder(bnr){
            this.ausgewaehlt = true;
            this.msg = "Bestellung: " + bnr
            this.gewaehlteBestellung = this.bestellungen.find(
            (element) => element.bnr == bnr)
            this.$router.push("/admin/bestellungen" + bnr)
        },
        // alle bestellungen von backend holen
        holeBestellungen(){
            if (this.bestellungen.length < 1) {
                UserService.getOrder("alle")
                .then((response) => {
                    this.bestellungen.push.apply(this.bestellungen, response.data.orders)
                })
                .catch((error) => Helper.handle(error));
            }
        }   
    },
    beforeMount(){
        if (this.$route.params.bnr != "") {
            this.ausgewaehlt = true
            this.msg = "Bestellung: " + this.$route.params.bnr
            UserService.getOrder(this.$route.params.bnr)
                .then((response) => {
                    this.gewaehlteBestellung = response.data.bestellung
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

<style >
p{
    color:white;
    text-align: center;
    font-size: small;
}
</style>
