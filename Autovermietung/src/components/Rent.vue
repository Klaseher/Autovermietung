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
        <button @click='bestellen()'>
            Anfrage
        </button>
    </div>
</template>

<script>
import DatepickerLite from "vue3-datepicker-lite";
import UserService from "../services/user.service";
import Helper from "../services/helper.service";
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
                if(startdatum.getTime() >= enddatum.getTime()){
                    alert('Enddatum muss nach Startdatum liegen')
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
            //Hier Bestellung in Backend erstellen mit Status 'offen'
            //Hier auch noch prüfen, dass Kunde nur eine Bestellung gleichzeitig in DB haben darf 
            //--> sonst könnte ein Kunde einfach alles auf einmal mieten

            //Bestätigung, wenn Bestellung erfolgreich erstellt wurde in DB
            alert('Die Mietanfrage für ' + this.$route.params.autoname + ' für den Zeitraum: ' + this.start + ' - ' + this.ende
            + ' wird von einem Mitarbeiter bearbeitet. Den Stand Ihrer Anfrage können Sie in Ihrem Account nachverfolgen')
            Helper.redirect('/login')
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
    beforeMount(){
        let from = new Date()
        let to = new Date();
        from.setDate(from.getDate() + 1) // kann nicht am selben Tag buchen
        to.setDate(to.getDate() + 90) //max. 3 Monate in Zukunft buchen
        //Zeiträume für Start-und Endkalender festlegen
        this.datepickerSetting.from = Helper.formatDate(from)
        this.datepickerSetting.to = Helper.formatDate(to)
        to.setDate(to.getDate() + 1) //Enddatum 1 Tag mehr
        from.setDate(from.getDate() + 1) //Enddatum Mind.-Datum 1 Tag mehr
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