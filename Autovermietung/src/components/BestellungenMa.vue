<template>
    <div>
        <div v-if="!ausgewaehlt">
            <h1>{{msg}}</h1>
            <button @click="update()">Aktualisieren</button>
            <select v-model="bestellungsauswahl">
                <option value="" disabled selected>Filter Bestellungen</option>
                <option
                    v-for="(bestellung, index) in bestellungstypen"
                    :key="index"
                    :value="bestellung"
                >
                    {{bestellung}}
                </option>
                </select>   
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
                    <tr v-for="(bestellung, index) in bestellungen" :key="index" :class="getClass(bestellung)">
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
            <button @click="home()">Zurueck</button>
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
            <button @click="abbrechen(gewaehlteBestellung.bnr)" :disabled="gewaehlteBestellung.status!=0">Abbrechen</button>
            <button @click="acceptOrder(gewaehlteBestellung.bnr)" :disabled="gewaehlteBestellung.status!=0">Bestaetigen</button>
            <button @click="showDamage(gewaehlteBestellung)">Anzeigen Offener Autoprobleme</button>
         </div>
    </div>
</template>


<script>
// Hier wird fuer Mitarbeiter/Admin alles bzgl. Bestellungen angezeigt/definiert
import UserService from "../services/user.service";
import Auth from "../services/auth.service";
import Helper from "../services/helper.service";
export default {
    data(){
        return{
            ausgewaehlt: false,
            msg: '',
            bestellungen: [],
            gewaehlteBestellung: '',
            schaeden: [],
            class: '',
            bestellungsauswahl: '',
            bestellungstypen: []
        }
    },
    methods: {
        // daten neu laden
        update(){
            // hier wird filter angewandt
        },
        // zurueck zur allgemeinen Bestellueubersicht
        back() {
            this.ausgewaehlt = false;
            this.msg = "Alle Bestellungen"
            this.holeBestellungen();
            this.$router.push("/admin/bestellungen")
        },
        home() {
            this.$router.push("/admin")
        },
        showDamage(bestellung){
            // vor bestaetigung behandlung schaeden
            if(bestellung.status == 0){
                Helper.redirect("/admin/"+bestellung.auto_fk+"/schaden");
            }
            // offene oder zeitlich ueberfaellige bestellungen
            else if(bestellung.status == 1 || bestellung.status == 5){
                 Helper.redirect("/admin/"+bestellung.auto_fk+"/schaden" + "/" + bestellung.bnr);
            }
        },
          abbrechen(bnr) {
            if(confirm("Moechten Sie die Bestellung BNR: " + bnr + " wirklich abbrechen?")){
                this.gewaehlteBestellung.status = 3
                Auth.updateStatusOrder(bnr, 3)
                .then(response =>{
                    if(response.data.success){
                        this.bestellungen.find(
                        (element) => element.bnr == bnr).status = 3
                        alert("Bestellung wurde erfolgreich abgebrochen.")
                        this.ausgewaehlt = false;
                        this.msg = "Alle Bestellungen"
                        Helper.redirect("/admin/bestellungen");
                        return
                    }
                })
                .catch((error) => {
                    Helper.handle(error)
                    this.ausgewaehlt = false;
                    this.msg = "Alle Bestellungen"
                    Helper.redirect("/admin/bestellungen");
                    return
                })
            }
        },
        //Bestellung akzeptieren --> 0 zu 1
        acceptOrder(bnr){
            // wegen async erst daten laden, danach bei 2tem click funktioniert es erst, wenn direkt auf bestellung via bnr zugegriffen wird
            if(this.bestellungen.length<1){
                this.holeBestellungen()
                alert("Die Daten muessen nachgeladen werden. Versuchen Sie es erneut")
            }
            else{
                let bestellung = this.bestellungen.find(
                (element) => element.bnr == bnr)
                let date = bestellung
                //ueberpruefung, ob doppelte bestellungen
                if(bestellung.doppelt){
                    let doppelt = [bestellung]
                    for(let i=0;i<this.bestellungen.length;i++){
                        if(bestellung.bnr == this.bestellungen[i].bnr){
                            continue
                        }
                        else if(bestellung.auto_fk == this.bestellungen[i].auto_fk && this.bestellungen[i].doppelt){
                            doppelt.push(this.bestellungen[i])
                        }
                    }
                    for(let i=1;i<doppelt.length;i++){
                        alert("Die Bestellung BNR: " + doppelt[i].bnr + " ueberschneidet sich mit dieser Bestellung")
                    }
                    for(let i=1;i<doppelt.length-1;i++){
                        let d1 = new Date(doppelt[i].zeitstempel) 
                        let d2 = new Date(doppelt[i+1].zeitstempel) 
                        if(d1.getTime() < d2.getTime()){
                            date = doppelt[i]
                        }
                        else{
                            date = doppelt[i+1]
                        }
                    }
                    if(confirm("Soll die frueheste Bestellung BNR: " +  date.bnr +" akzeptiert und automatisch die anderen Anfragen abgebrochen werden?")){
                        doppelt.forEach(async (item) => {
                            if(item.bnr == date.bnr){
                                return
                            }
                            await this.abbrechen(item.bnr)
                        })
                    }
                    else{
                        return
                    }   
                }
                UserService.getSchaeden(date.auto_fk)
                    .then((response) => {
                        // wenn kein schaden, dann kann bestellung bestaetigt werden
                        if(response.data.success){
                            Auth.updateStatusOrder(date.bnr, 1)
                            .then((response) =>{
                                if(response.data.success){
                                    this.bestellungen.find(
                                    (element) => element.bnr == date.bnr).status = 1
                                    alert("Bestellung wurde erfolgreich bestaetigt.")
                                    this.ausgewaehlt = false;
                                    this.msg = "Alle Bestellungen"
                                    Helper.redirect("/admin/bestellungen");
                                    return
                                }
                            })
                             .catch((error) => {
                                Helper.handle(error)
                                this.ausgewaehlt = false;
                                this.msg = "Alle Bestellungen"
                                Helper.redirect("/admin/bestellungen");
                                return
                            })
                        }
                        // offene schaeden sind vorhanden
                        else{
                            let val = false
                            this.schaeden.push.apply(this.schaeden, response.data.cardamage)
                            for(let i=0;i<this.schaeden.length;i++){
                                 if(this.schaeden[i].prioritaet == 0){
                                    if(confirm("Das Auto kann nicht ausgeleihen werden wegen offener fataler Probleme.\nMoechten Sie diese jetzt bearbeiten?")){
                                        val = true
                                        Helper.redirect("/admin/" + date.auto_fk + "/schaden");
                                        return
                                    }
                                    val = true
                                    return
                                }
                            }
                            if(!val){
                                if(confirm("Es bestehen noch offene Probleme, die aber nicht fatal sind. Moechten Sie die Bestellung bestaetigen")){    
                                    Auth.updateStatusOrder(date.bnr, 1)
                                        .then((response) =>{
                                            if(response.data.success){
                                                this.bestellungen.find(
                                                (element) => element.bnr == date.bnr).status = 1
                                                alert("Bestellung wurde erfolgreich bestaetigt.")
                                                this.ausgewaehlt = false;
                                                this.msg = "Alle Bestellungen"
                                                Helper.redirect("/admin/bestellungen");
                                                return
                                            }
                                        })
                                        .catch((error) => {
                                            Helper.handle(error)
                                            this.ausgewaehlt = false;
                                            this.msg = "Alle Bestellungen"
                                            Helper.redirect("/admin/bestellungen");
                                            return
                                        })
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        Helper.handle(error)
                        this.ausgewaehlt = false;
                        this.msg = "Alle Bestellungen"
                        Helper.redirect("/admin/bestellungen");
                    })
            }
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
        getClass(bestellung) {
              if (bestellung.doppelt) {
                this.class="doppelt"
                return this.class
              }
              else if (bestellung.status == 2) {
                this.class = "bezahlen"
                return this.class
              }
              else{
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
               return 'Bezahlung ausstehend'
           }
           else if(status == 3){
               return 'Abgebrochene Bestellung'
           }
           else if(status == 4){
               return 'Erfolgreich abgeschlossene Bestellung'
           }
        }   
    },
    beforeMount(){                  //0                       3,4                   2                        doppelt = true          5                              1
        this.bestellungstypen = ["Offene Bestellanfragen", "Bestellungshistorie", "Offene Bezahlung", "Doppelte Bestellungen", "Ueberzogene Bestellungen", "Laufende Bestellungen"];
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
                    this.msg = "Alle Bestellungen"
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
.bezahlen {
    background-color: orange
}
.normal {
    background-color: white
}
</style>
