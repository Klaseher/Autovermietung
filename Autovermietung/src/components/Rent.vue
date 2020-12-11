<template>
<div>
        <h1>Auto buchen</h1>
        <br />
        <br />
        <br /> <h3>{{auto.name}}</h3>
        <br /> <h3>{{user.vorname}} {{user.nachname}}</h3>
        <br /> <h3>{{user.adresse}}</h3>
        <br /> <h3>{{user.telefon}}</h3>
        <br /> <h3>{{user.user}}</h3>
        <br />
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
            :disabled-date="datepickerSetting.disabledDate"
            :locale="datepickerSetting2.locale"
            @value-changed="datepickerSetting2.changeEvent"
         />
        <br />
        <br />
        <br />
        <br /> <h3>Kosten: {{kosten}} €</h3>
        <button
            @click='bestellen()'
            :disabled="!verfuegbarkeit(auto.verfuegbar)"
            >
            Anfrage
        </button>
    </div>
</template>

<script>
// Hier kann Kunde Bestellung erstellen
import DatepickerLite from "vue3-datepicker-lite";
import UserService from "../services/user.service";
import Helper from "../services/helper.service";
import Auth from "../services/auth.service";
export default {
    data(){
        return{            
            name: '',
            adresse: '',
            telefon: '',
            email: '',
            start: '',
            ende: '',
            user: '',
            auto: '',
            cost: '',
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
                    let date = new Date()
                    let date2 = new Date(value)
                    if(date2.getTime() <= date.getTime()){
                        this.start = ''
                        alert('Ungültiges Startdatum')
                    }
                    else{
                        this.start = value
                    }
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
                    let date = new Date()
                    let date2 = new Date(value)
                    if(date2.getTime() <= date.getTime()){
                        this.ende = ''
                        alert('Ungültiges Enddatum')
                    }
                    else{
                        this.ende = value
                    }
                }
            }
        }
    },
    components: {
        DatepickerLite
    },
    methods: {
        // kann keine bestellung fuer auto erstellen, welches derzeit nicht verfuegbar ist
         verfuegbarkeit(vorhanden) {
            if (vorhanden == 1) {
                return true;
            } else {
                return false;
            }
         },
         // kosten an backend geben
         setKosten(cost) {
           this.cost = cost
         },
        //Hier Methode zum Bestellen
        bestellen(){
            if(this.start == '' && this.ende == ''){
                alert('Start- und Enddatum dürfen nicht leer sein')
                return
            }
            else if(this.start == ''){
                alert('Bitte aktualisieren Sie erst das Startdatum zu einem gültigen Datum')
                return
            }
            else if(this.ende == ''){
                alert('Bitte aktualisieren Sie erst das Enddatum zu einem gültigen Datum')
                return
            }
            else{
                let startdatum = new Date(this.start)
                let enddatum = new Date(this.ende)
                if(startdatum.getTime() > enddatum.getTime()){
                    alert('Enddatum darf nicht vor Startdatum liegen')
                    return
                }
                else{
                    let bestellung
                    for(bestellung of this.zeiten){ 
                        let von = new Date(bestellung.startdatum)
                        let bis = new Date(bestellung.enddatum)
                        let startdatum = new Date(this.start)
                        let enddatum = new Date(this.ende)
                        if(((startdatum.getTime() < von.getTime()) && (enddatum.getTime() > bis.getTime()))){
                            alert(this.$route.params.autoname + ' ist bereits innerhalb des Zeitraumes gemietet')
                            return
                        }


                    }    

                }
            }
            //Hier Bestellung in Backend erstellen mit Status '0'
            //Hier auch noch prüfen, dass Kunde nur eine Bestellung gleichzeitig in DB haben darf 
            //--> sonst könnte ein Kunde einfach alles auf einmal mieten
            Auth.createOrder(this.auto.name, this.start, this.ende, this.cost)
            .then(response => {
                if(response.data.success){
                     //Bestätigung, wenn Bestellung erfolgreich erstellt wurde in DB
                    alert('Die Mietanfrage für ' + this.$route.params.autoname + ' für den Zeitraum: ' + this.start + ' - ' + this.ende
                      + ' wird von einem Mitarbeiter bearbeitet. Den Stand Ihrer Anfrage können Sie in Ihrem Account nachverfolgen')
                     Helper.redirect('/login')     
                }
            })
            .catch((error) => {
              Helper.handle(error)
              Helper.redirect('/')
            })
        },
        //Alle Tage zw. (inklusive) Start- und Enddatum deaktivieren
        erstelleDeaktivierteZeiten(){
            let bestellung = ''
            for(bestellung of this.zeiten){             
                let start = new Date(bestellung.startdatum)
                let stop = new Date(bestellung.enddatum)
                let current = start
                while (current.getTime() <= stop.getTime()) {
                    this.datepickerSetting.disabledDate.push(Helper.formatDate(current));
                    current.setDate(current.getDate() + 1)
                }
            }
        }
    },
    computed: {
        // kosten berechnen durch bestimmung zeitraumlaenge in tage
        kosten: function () {
            if(this.start != '' && this.ende != ''){
                let startdatum = new Date(this.start)
                let enddatum = new Date(this.ende)
                if(startdatum.getTime() > enddatum.getTime()){
                        return ''
                }
                else{
                    let oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                    let diffDays = Math.floor((enddatum.getTime() - startdatum.getTime())/(oneDay))
                    let cost = this.auto.preis * (diffDays +1)
                    this.setKosten(cost)
                    return cost
                }
            }
            else{
                return ''
            }
        }
    },
    beforeMount(){
        let from = new Date()
        let to = new Date();
        from.setDate(from.getDate() + 1) // kann nicht am selben Tag buchen
        to.setDate(to.getDate() + 90) //max. 3 Monate in Zukunft buchen
        //Zeiträume für Start-und Endkalender festlegen
        this.datepickerSetting.from = Helper.formatDate(from)
        this.datepickerSetting.to = Helper.formatDate(to)
        this.datepickerSetting2.from = Helper.formatDate(from)
        this.datepickerSetting2.to = Helper.formatDate(to)
        UserService.getUser()
        .then((response) =>{
            this.user = response.data.user;     
            UserService.getCar(this.$route.params.autoname)
                .then((response) =>{
                    this.auto = response.data.car  
                    this.zeiten = response.data.carTimes
                    this.erstelleDeaktivierteZeiten()            
                })
                .catch((error) => {
                    Helper.handle(error)
                    Helper.redirect("/");
                })           
        })
        .catch((error) => {
            Helper.handle(error)
            Helper.redirect("/");
        })
    }
  
}
</script>

<style scoped>
h1{
    color: blue;
}
p{
    color: black;
}

</style>