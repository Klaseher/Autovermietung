<template>
    <div>
        <h1> {{msg}} </h1>
         <textarea v-model="beschreibung" name="text" cols="35" rows="4">Schaden hier beschreiben</textarea> 
          <input
          type="text"
          placeholder="Kosten"
          v-model="kosten"
          required
          autofocus
         />
         <input
          type="text"
          placeholder="Prioritaet"
          v-model="prio"
          required
          autofocus
        />
        <select v-model="auswahl">
          <option value="" disabled selected>Schadenstyp</option>
          <option
            v-for="(schaden, index) in schadenstypen"
            :key="index"
            :value="schaden"
          >
          {{schaden}}
          </option>
        </select>
        <button type="submit" @click="erstelleSchaden()">Erstellen</button>
        <div v-if="allgemein">
         <table>
                <thead>
                    <tr>
                        <th>Beschreibung</th>
                        <th>Typ</th>
                        <th>Prioritaet</th>
                        <th>Kosten in €</th>
                        <th>Abgearbeitet?</th>
                        <th>Loeschen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(schaden, index) in schaeden" :key="index">
                        <td>{{schaden.beschreibung}}</td>
                        <td>{{schaden.typ}}</td>
                        <td>{{schaden.prioritaet}}</td>
                        <td>{{schaden.hoehe}}</td>
                        <td><button @click="updateCheck(schaden)">Problem beheben</button></td>
                        <td><button @click="loescheSchaden">Loeschen</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
                  <table>
                <thead>
                    <tr>
                        <th>Beschreibung</th>
                        <th>Typ</th>
                        <th>Prioritaet</th>
                        <th>Kosten in €</th>
                        <th>Loeschen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(schaden, index) in schaeden" :key="index">
                        <td>{{schaden.beschreibung}}</td>
                        <td>{{schaden.typ}}</td>
                        <td>{{schaden.prioritaet}}</td>
                        <td>{{schaden.hoehe}}</td>
                        <td><button @click="loescheSchaden">Loeschen</button></td>
                    </tr>
                </tbody>
            </table>
        </div>  
        <button type="cancel" @click="back">Zurueck zum Start</button>
    </div>
</template>


<script>
import UserService from "../services/user.service";
import Auth from "../services/auth.service";
import Helper from "../services/helper.service";
export default {
    data(){
        return{
            msg: '',
            auswahl: '',
            beschreibung: '',
            prio: '',
            kosten: '',
            allgemein: '',
            schaeden: [],
            schadenstypen: []
        }
    },
    methods: {
        back() {
            this.$router.push("/admin")
        },
        // nur schaden wird allgemein geloescht
        loescheSchaden(){
            // nur schaden loeschen
            if(this.allgemein){
                return
            }
            //loesche aus kosten u. schaden
            else{
                return
            }

        },
        updateCheck(schaden){
            if(confirm("Ist der Schaden wirklich behoben?")){
                 Auth.updatePriority(schaden.auto_fk, schaden.pos, -1)
                    .then((response) =>{
                        if(response.data.success){
                            // schaden lokal aus array entfernen --> "aktualisieren"
                            let index = this.schaeden.indexOf(schaden)
                            this.schaeden.splice(index, 1);
                            alert("Schaden wurde erfolgreich behoben")
                        }
                    })
                    .catch((error) => {
                        Helper.handle(error)
                        Helper.redirect("/admin/admin");
                    })
                }
        },
        status(status) {
            if(status == 'Tank'){
                return 1
            }
            else if(status == 'Sauberkeit'){
                return 2
            }
            else if(status == 'Schaden'){
                return 4
            }
        }, 
        erstelleSchaden(){
            if(this.auswahl != '' && this.beschreibung != '' && this.prio != '' && this.kosten != ''){
                var zahlentester = new RegExp("^[0-9 ]*$")
                if(zahlentester.test(this.prio) && zahlentester.test(this.kosten)){
                     Auth.addSchaden(this.$route.params.autoname, this.beschreibung, this.prio, this.status(this.auswahl), this.kosten)
                    .then((response) =>{
                        if(response.data.success){
                            // wenn bnr vorhanden, dann werden auch noch dazu kosten hinzugefuegt
                            if(!this.allgemein){
                              Auth.addCost(this.$route.params.bnr, this.status(this.auswahl), this.kosten, this.beschreibung)
                                .then((response) =>{
                                    if(response.data.success){
                                        this.prio = ''
                                        this.kosten = ''
                                        this.beschreibung = ''
                                        this.auswahl = ''
                                        this.schaeden.push({auto_fk: this.$route.params.autoname, pos: response.data.pos, beschreibung: this.beschreibung, prioritaet: this.prio, typ:this.status(this.auswahl), hoehe: this.kosten})
                                        alert("Schaden erfolgreich hinzugefuegt")
                                       }
                                })
                                .catch((error) => {
                                    Helper.handle(error)
                                    Helper.redirect("/admin");
                                })
                            }
                            else{
                                this.schaeden.push({auto_fk: this.$route.params.autoname, pos: response.data.pos, beschreibung: this.beschreibung, prioritaet: this.prio, typ:this.status(this.auswahl), hoehe: this.kosten})
                                this.prio = ''
                                this.kosten = ''
                                this.beschreibung = ''
                                this.auswahl = ''
                                alert("Schaden erfolgreich hinzugefuegt")
                            }
                        }
                    })
                    .catch((error) => {
                        Helper.handle(error)
                        Helper.redirect("/admin");
                    })
                }
                else{
                    this.prio = ''
                    this.kosten = ''
                    alert("Prioritaet/Kosten muss Zahl sein")
                }
            }
            else{
                alert("Alle Felder muessen ausgefuellt sein")
            }
        }

    },
    beforeMount(){
        // kann ohne oder mit bestellungsreferenz aufrufen --> mit referenz kann schaden hinzugefuegt werden
        
        if(!this.$route.params.bnr){
            this.allgemein = true
            this.msg = "Uebersicht Schaeden Auto: " + this.$route.params.autoname
        }
        else{
            this.allgemein = false
            this.msg = "Uebersicht Schaeden Auto: " + this.$route.params.autoname + " BNR: " + this.$route.params.bnr
            //hier noch testen, ob es zu bnr auch noch bestellung mit passender auto_fk gibt -->
        }
          this.schadenstypen = ["Tank", "Sauberkeit", "Schaden"]
          //hier schaeden holen fuer auto
            UserService.getSchaeden(this.$route.params.autoname)
            .then((response) =>{
                this.schaeden.push.apply(this.schaeden, response.data.cardamage)    
                if(!this.allgemein){
                    UserService.testOrder(this.$route.params.bnr, this.$route.params.autoname)
                    .then((response) => {
                        if(!response.data.success){
                            alert("Zum gewaehlten Auto gibt es die gewaehlte Bestellung nicht!")
                            Helper.redirect("/admin")
                        }
                    })
                    .catch((error) => {
                        Helper.handle(error);
                        this.ausgewaehlt = false;
                        this.msg = ""
                        Helper.redirect("/admin/bestellungen")
                    })  
                }
            })
            .catch((error) => {
                Helper.handle(error)
                Helper.redirect("/admin");
            })
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
