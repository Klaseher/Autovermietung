<template>
    <div class="ma">
        <div v-if="!ausgewaehlt">
            <h1>{{msg}}</h1>
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
            <button @click="update()">Aktualisieren</button>
            <div>
                <datepicker-lite 
                :value-attr="datepickerSetting.value"
                :year-minus="datepickerSetting.yearMinus"
                :from="datepickerSetting.from"
                :to="datepickerSetting.to"
                :disabled-date="datepickerSetting.disabledDate"
                :locale="datepickerSetting.locale"
                @value-changed="datepickerSetting.changeEvent"
                />
                <datepicker-lite 
                :value-attr="datepickerSetting2.value"
                :year-minus="datepickerSetting2.yearMinus"
                :from="datepickerSetting2.from"
                :to="datepickerSetting2.to"
                :disabled-date="datepickerSetting2.disabledDate"
                :locale="datepickerSetting2.locale"
                @value-changed="datepickerSetting2.changeEvent"
                />
                <input type="text" placeholder="Nach BNR suchen" v-model="bnr">
                <input type="text" placeholder="Nach Vorname suchen" v-model="vorname">
                <input type="text" placeholder="Nach Nachname suchen" v-model="nachname">
                <button @click="suchen()">Suchen</button>
            </div>
            <br /> 
            <br />  
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
                    <tr v-for="(bestellung, index) in gesuchteBestellungen" :key="index" :class="getClass(bestellung)">
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
             <br /> 
            <br />  
            <button @click="home()">Zurueck</button>
        </div>
        <div  v-else>
            <h1>{{msg}}</h1>
            <br /> <h3>Auto: {{gewaehlteBestellung.auto_fk}}</h3>
            <br /> <h3>Kunde: {{gewaehlteBestellung.vorname}} {{gewaehlteBestellung.nachname}}</h3>
            <br /> <h3>Email: {{gewaehlteBestellung.user}}</h3>
            <br /> <h3>Adresse: {{gewaehlteBestellung.adresse}}</h3>
            <br /> <h3>Telefon: {{gewaehlteBestellung.telefon}}</h3>
            <br /> <h3>Mietzeitraum: {{gewaehlteBestellung.startdatum}} - {{gewaehlteBestellung.enddatum}}</h3>
            <button type="cancel" @click="back">Zurueck zur Suche</button>
            <button @click="abbrechen(gewaehlteBestellung.bnr, 0)" :disabled="gewaehlteBestellung.status!=0">Abbrechen</button>
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
import DatepickerLite from "./DatepickerLite.vue";
export default {
    data(){
        return{
            ausgewaehlt: false,
            msg: '',
            bestellungen: [],
            gesuchteBestellungen: [],
            gewaehlteBestellung: '',
            schaeden: [],
            class: '',
            bestellungsauswahl: '',
            bestellungstypen: [],
            bnr: '',
            vorname: '',
            nachname: '',
            erstelldatum: '',
            start: '',
            ende: '',
            datepickerSetting : {
                value:"",
                yearMinus: 0,
                from: "",
                to: "1999/01/01",
                disabledDate: [],
                locale: {
                format: "YYYY/MM/DD",
                weekday: ["Son", "Mon", "Dien", "Mit", "Don", "Frei", "Sam"],
                todayBtn: "Heute",
                clearBtn: "Löschen",
                closeBtn: "Schliessen",
                },
                changeEvent: (value) => {
                    this.start = value
                }
            },
            //enddatum
            datepickerSetting2 : {
                value: "",
                yearMinus: 0,
                from: "",
                to: "1999/01/01",
                disabledDate: [],
                locale: {
                format: "YYYY/MM/DD",
                weekday: ["Son", "Mon", "Dien", "Mit", "Don", "Frei", "Sam"],
                todayBtn: "Heute",
                clearBtn: "Löschen",
                closeBtn: "Schliessen",
                },
                changeEvent: (value) => {
                    this.ende = value
                }
            }
        }
    },
    components: {
        DatepickerLite
    },
    methods: {
        // daten neu laden bzw. bestimmte bestellungstypen anzeigen
        update(){
            if(this.bestellungsauswahl == ''){
                alert("Bitte waehlen Sie einen Filter aus")
                return
            }
            this.bestellungen = []
            this.gesuchteBestellungen = []
            let typ = -1
            if (this.bestellungsauswahl == "Offene Bestellanfragen") typ = 0
            else if(this.bestellungsauswahl == "Bestellungshistorie") typ = 7 //3 u. 4
            else if(this.bestellungsauswahl == "Offene Bezahlung") typ = 2
            else if(this.bestellungsauswahl == "Ueberzogene Bestellungen") typ = 5
            else if(this.bestellungsauswahl =="Laufende Bestellungen") typ = 1
            else if(this.bestellungsauswahl == "Doppelte Bestellungen") typ = 6
            else if(this.bestellungsauswahl == "Alle Bestellungen") typ = 8
            this.holeBestellungen(typ)
        },
        // bestimmte bestellungen suchen
        suchen(){
            this.gesuchteBestellungen = this.bestellungen.filter((bestellung) => {
                let bnr = false;
                let name = false
                let datum = false
                let startdatum = new Date(this.start)
                let enddatum = new Date(this.ende)
                let zeitstempel = new Date(bestellung.zeitstempel)
                if (this.bnr == "") {
                    bnr = true;
                } else {
                    bnr = bestellung.bnr == this.bnr;
                }

                if (this.vorname == "" || this.nachname == "") {
                    name = true
                } else name = (
                    this.vorname.toLowerCase().split(" ").every((v) => bestellung.vorname.toLowerCase().includes(v)) &&
                    this.nachname.toLowerCase().split(" ").every((v) => bestellung.nachname.toLowerCase().includes(v))
                )
                if((this.start == '' && this.ende == '') || (startdatum.getTime() > enddatum.getTime())){
                    datum = true
                }
                else if(this.ende == ''){
                    if(startdatum.getTime() == zeitstempel.getTime()){
                        datum = true
                    }
                    else{
                        datum = false
                    }
                }
                else if(this.start == ''){
                    if(enddatum.getTime() == zeitstempel.getTime()){
                        datum = true
                    }
                    else{
                        datum = false
                    }
                }
                else{
                    if((startdatum.getTime() <= zeitstempel.getTime()) && (enddatum.getTime() >= zeitstempel.getTime())){
                        datum = true
                    }
                    else{
                        datum = false
                    }
                }
                return (bnr && name && datum)
            })
        },
        // zurueck zur allgemeinen Bestellueubersicht
        back() {
            this.ausgewaehlt = false;
            this.msg = "Alle Bestellungen"
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
          abbrechen(bnr, skip) {
            let bestaetigen = false 
            if(!skip){
                bestaetigen = confirm("Moechten Sie die Bestellung BNR: " + bnr + " wirklich abbrechen?")
            } 
            else{
                bestaetigen = true  
            }
            if(bestaetigen){
                Auth.updateStatusOrder(bnr, 3)
                .then(response =>{
                    if(response.data.success){
                        if(this.$route.params.bnr != ""){
                            this.gewaehlteBestellung.status = 3
                        }
                        this.bestellungen.find(
                        (element) => element.bnr == bnr).status = 3
                        if(!skip) alert("Bestellung wurde erfolgreich abgebrochen.")
                        Helper.redirect("/admin/bestellungen");
                        return
                    }
                })
                .catch((error) => {
                    Helper.handle(error)
                    Helper.redirect("/admin/bestellungen");
                    return
                })
            }
        },
        //Bestellung akzeptieren --> 0 zu 1
        acceptOrder(bnr){
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
                        await this.abbrechen(item.bnr, 1)
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
                                Helper.redirect("/admin/bestellungen");
                                return
                            }
                        })
                            .catch((error) => {
                            Helper.handle(error)
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
                                            Helper.redirect("/admin/bestellungen");
                                            return
                                        }
                                    })
                                    .catch((error) => {
                                        Helper.handle(error)
                                        Helper.redirect("/admin/bestellungen");
                                        return
                                    })
                            }
                        }
                    }
                })
                .catch((error) => {
                    Helper.handle(error)
                    Helper.redirect("/admin/bestellungen");
                })
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
        // geladene Bestellungen werden geprueft, ob sie offen, aber schon abgelaufen sind --> automatisch abgebrochen
        testAbgelaufen(){
            this.bestellungen.forEach(async (item) => {
                let heute = new Date()
                let start = new Date(item.startdatum)
                if(start.getTime() <= heute.getTime() && item.status == '0'){
                    await this.abbrechen(item.bnr, 1)
                }
            })
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
        holeBestellungen(typ){
            if (this.bestellungen.length < 1) {
                let bestelltyp = ''
                if(typ == 7){
                    bestelltyp = "geschlossen"
                }
                else if(typ == 6){
                    bestelltyp = "offen " + 0
                }
                else if(typ == 8 || typ == 9){
                    bestelltyp = "alle"
                }
                else{
                    bestelltyp = "offen " + typ
                }
                UserService.getOrder(bestelltyp)
                .then((response) => {
                    response.data.orders.forEach((order) => {
                        order.doppelt = false
                        this.bestellungen.push(order)
                    })
                    if(typ == 0 || typ == 6){
                        this.testdoppelt()
                    } 
                    //nur doppelte anzeigen
                    if(typ == 6){
                        let bestellungen = []
                        for(let i=0;i<this.bestellungen.length;i++){
                             if(this.bestellungen[i].doppelt){
                                 bestellungen.push(this.bestellungen[i])
                             }
                        }
                        this.bestellungen = bestellungen
                    }
                    // wenn einzelne bestellung angesehen wird, muessen alle bestellungen geladen werden
                    //um moegliche konflikte zu sehen u. auch spezifische bestellung zu finden
                    if(typ == 9){
                        this.gewaehlteBestellung = this.bestellungen.find(
                        (element) => element.bnr == this.$route.params.bnr)
                    }
                    this.testAbgelaufen()
                    this.gesuchteBestellungen = this.bestellungen
                     // filter automatisch auf geladene datensaetze angewandt
                    this.suchen()
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
    beforeMount(){     
        let heute = new Date()
        this.datepickerSetting.value = Helper.formatDate(heute)
                                                           //0                       3,4                   2                           5                   doppelt = true              1
        this.bestellungstypen = ["Alle Bestellungen", "Offene Bestellanfragen", "Bestellungshistorie", "Offene Bezahlung", "Ueberzogene Bestellungen","Doppelte Bestellungen", "Laufende Bestellungen"];
        if (this.$route.params.bnr != "") {
            this.ausgewaehlt = true
            this.msg = "Bestellung: " + this.$route.params.bnr
            this.holeBestellungen(9)
        }
        else{
            this.ausgewaehlt = false
            this.msg = "Alle Bestellungen"
            this.holeBestellungen(0)
        }
    }
}
 
</script>

<style scoped>
/* .ma{
    background-color: cornflowerblue;
    background-size: 100% 100%;
    min-height: 200%;


} */

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
    background-color: rgb(193, 197, 233)
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  border-spacing: 5px;
  width: 100%;
}
button{
  box-shadow: 0px 0px 0px 2px #9fb4f2;
	/* background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
	background-color:#7892c2;
	border-radius:10px;
	border:1px solid #4e6096;
	display:inline-block;
	cursor:pointer; */
	color:#ffffff;
	font-family:Arial;
	font-size:14px;
	padding:20px 40px 20px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center;
  width: 20%;
}

</style>
