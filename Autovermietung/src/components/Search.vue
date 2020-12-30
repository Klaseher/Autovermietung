<template>
  <div class="container">
    <h1>Verfügbare Autos</h1>
    <hr>
    <main class="search" v-if="!ausgewaehlt">
      <h1>Suchergebnisse für: {{ msg }}</h1>
      <form>
        <div class="form-row">
          <div class="col">
            <input
                type="text"
                placeholder="Autoname"
                v-model="autoname"
                required
                autofocus
                class="form-control"
            />
          </div>
          <div class="col">
            <div class="form-group">
              <datepicker-lite
                  :value-attr="datepickerSetting.value"
                  :year-minus="datepickerSetting.yearMinus"
                  :from="datepickerSetting.from"
                  :to="datepickerSetting.to"
                  :disabled-date="datepickerSetting.disabledDate"
                  :locale="datepickerSetting.locale"
                  @value-changed="datepickerSetting.changeEvent"
                  classAttr="form-control"
                  placeholderAttr="Datum auswählen"
              />
            </div>
          </div>
          <div class="col">
            <datepicker-lite
                :value-attr="datepickerSetting2.value"
                :year-minus="datepickerSetting2.yearMinus"
                :from="datepickerSetting2.from"
                :to="datepickerSetting2.to"
                :disabled-date="datepickerSetting2.disabledDate"
                :locale="datepickerSetting2.locale"
                @value-changed="datepickerSetting2.changeEvent"
                classAttr="form-control"
                placeholderAttr="Datum auswählen"
            />
          </div>
          <div class="col">
            <button class="btn btn-primary" type="submit" @click="searchCar()">Autosuche</button>
          </div>
        </div>
      </form>

      <div v-on:click="seen = !seen">
        <button class="btn btn-secondary">Erweiterte Suche</button>
        <br/>
        <div>
          <h2></h2>
        </div>
      </div>
      <div v-if="seen">
        <form>
          <div class="form-row  form-group">
            <div class="col">
              <input
                  type="text"
                  placeholder="Mindestpreis (€)"
                  v-model="preis_min"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
            <div class="col">
              <input
                  type="text"
                  placeholder="Höchstpreis (€)"
                  v-model="preis_max"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
            <div class="col">
              <input
                  type="text"
                  placeholder="Anzahl Sitze"
                  v-model="platz"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
            <div class="col">
              <input
                  type="text"
                  placeholder="Anzahl Türen"
                  v-model="tuer"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
          </div>
          <div class="form-row  form-group">
            <div class="col">
              <select v-model="typ" class="form-control">
                <option value="" disabled selected>Autotyp (z.B. Kleinwagen)</option>
                <option value="">Alle</option>
                <option v-for="(typ, index) in autotypen" :key="index" :value="typ">
                  {{ typ }}
                </option>
              </select>
            </div>
            <div class="col">
              <select v-model="kraftstoff" class="form-control">
                <option value="" disabled selected>Kraftstoff</option>
                <option value="">Alle</option>
                <option
                    v-for="(kraftstoff, index) in kraftstofftypen"
                    :key="index"
                    :value="kraftstoff"
                >
                  {{ kraftstoff }}
                </option>
              </select>
            </div>
            <div class="col">
              <select v-model="getriebe" class="form-control">
                <option value="" disabled selected>Getriebeart</option>
                <option value="">Alle</option>
                <option
                    v-for="(getriebe, index) in getriebetypen"
                    :key="index"
                    :value="getriebe"
                >
                  {{ getriebe }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row form-group">
            <div class="col">
              <input
                  type="text"
                  placeholder="Co2-Ausstoß (g/km)"
                  v-model="c02"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
            <div class="col">
              <input
                  type="text"
                  placeholder="Spritverbrauch (l/100km)"
                  v-model="verbrauch"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
            <div class="col">
              <input
                  type="text"
                  placeholder="Tankvolumen (l)"
                  v-model="tankvolumen"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
            <div class="col">
              <input
                  type="text"
                  placeholder="Leistung (PS)"
                  v-model="leistung"
                  required
                  autofocus
                  class="form-control"
              />
            </div>
          </div>
        </form>
      </div>
      <h2>Suchergebnisse</h2>
      <hr>

      <div v-for="auto in gesuchteAutos" :key="auto.name" class="auto form-group table-responsive">
        <h3>{{ auto.name }}</h3>
        <table class="table">
          <tr>
            <!-- <td>{{auto.name}}</td> -->

            <td>Typ:</td>
            <td>{{ auto.typ }}</td>
            <td>CO2:</td>
            <td>{{ auto.co2 }}</td>
            <td>Mieten:</td>
            <td>
              <button
                  type="submit"
                  @click="mieten(auto.name)"
                  :disabled="!verfuegbarkeit(auto.verfuegbar)"
                  class="btn btn-secondary"
              >
                Mieten
              </button>
            </td>
          </tr>
          <tr>
            <td>Sitzplätze:</td>
            <td>{{ auto.sitzplaetze }}</td>
            <td>Türen:</td>
            <td>{{ auto.tueren }}</td>
          </tr>

          <tr>
            <td>Kraftstoff:</td>
            <td>{{ auto.kraftstoff }}</td>

            <td>Leistung:</td>
            <td>{{ auto.leistung }}</td>
          </tr>

          <tr>
            <td>Verbrauch:</td>
            <td>{{ auto.verbrauch }}</td>

            <td>Tankvolumen:</td>
            <td>{{ auto.tankvolumen }}</td>
          </tr>
          <tr>
            <td>Getriebe:</td>
            <td>{{ auto.getriebe }}</td>
            <td>Preis:</td>
            <td>{{ auto.preis }}</td>
            <td>Modell:</td>
            <td>{{ auto.modelbezeichnung }}</td>
          </tr>
        </table>
      </div>
    </main>
    <div v-else class="search-result">
      <div class="text-center description">
      <p>Auto: {{ gewaehltesauto.name }}</p>
      <p>Preis/Tag: {{ gewaehltesauto.preis }}</p>
      <p>Verbrauch: {{ gewaehltesauto.verbrauch }}</p>
      </div>
      <div class="actions">
      <button type="cancel" class="btn btn-secondary" @click="back">Zurueck zur Suche</button>
      <button
          class="btn btn-primary"
          type="submit"
          @click="buchen()"
          :disabled="!verfuegbarkeit(gewaehltesauto.verfuegbar)"
      >
        Jetzt {{ gewaehltesauto.name }} verbindlich mieten
      </button>
      </div>
    </div>
  </div>
</template>

<script>

import DatepickerLite from "./DatepickerLite.vue";
import UserService from "../services/user.service";
import Helper from "../services/helper.service";

export default ({
  name: "App",
  components: {
    DatepickerLite
  },
  data() {
    return {
      //startdatum
      datepickerSetting: {
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
          if (date2.getTime() <= date.getTime()) {
            this.start = ''
            alert('Ungültiges Startdatum')
          } else {
            this.start = value
          }
        }
      },
      //enddatum
      datepickerSetting2: {
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
          if (date2.getTime() <= date.getTime()) {
            this.ende = ''
            alert('Ungültiges Datum. Es wird bei der Suche ignoriert')
          } else {
            this.ende = value
          }
        }
      },
      msg: "Alle Autos",
      start: '',
      ende: '',
      preis_min: "",
      preis_max: "",
      autoname: "",
      platz: "",
      tuer: "",
      typ: "",
      c02: "",
      verbrauch: "",
      kraftstoff: "",
      tankvolumen: "",
      leistung: "",
      getriebe: "",
      gewaehltesauto: "",
      autos: [],
      zeiten: [],
      gesuchteAutos: [],
      kratstofftypen: [],
      autotypen: [],
      getriebetypen: [],
      seen: false,
      ausgewaehlt: false,
    };
  },
  methods: {
    ladeAutos() {
      if (this.autos.length < 1) {
        UserService.getCar("alle")
            .then((response) => {
              this.autos.push.apply(this.autos, response.data.cars)
              this.zeiten.push.apply(this.zeiten, response.data.times)
              this.gesuchteAutos = this.autos;
            })
            .catch((error) => Helper.handle(error));
      }
    },
    searchCar() {
      this.ladeAutos();
      let startdatum = new Date(this.start)
      let enddatum = new Date(this.ende)
      if (this.start == '' && this.ende == '') {
        alert('Start- und Enddatum werden für die Suche ignoriert')
      } else if (this.start == '') {
        alert('Das Startdatum wird für die Suche ignoriert')
      } else if (this.ende == '') {
        alert('Das Enddatum wird für die Suche ignoriert')
      } else if (startdatum.getTime() > enddatum.getTime()) {
        alert('Enddatum darf nicht hinter Startdatum liegen.\nDer Zeitraum wird bei der Suche ignoriert')
      }
      this.gesuchteAutos = this.autos.filter((auto) => {
        let co2 = false;
        let max = false;
        let tuer = false;
        let platz = false;
        let verbrauch = false;
        if (this.c02 == "") {
          co2 = true;
        } else {
          co2 = auto.co2 <= this.c02;
        }
        if (this.preis_max == "") {
          max = true;
        } else max = auto.preis <= this.preis_max;
        if (this.tuer == "") {
          tuer = true;
        } else tuer = auto.tueren == this.tuer;
        if (this.platz == "") {
          platz = true;
        } else platz = auto.sitzplaetze == this.platz;
        if (this.verbrauch == "") {
          verbrauch = true;
        } else {
          verbrauch = auto.verbrauch <= this.verbrauch;
        }
        let zeit = this.zeitFilter(auto)
        return (
            this.autoname
                .toLowerCase()
                .split(" ")
                .every((v) => auto.name.toLowerCase().includes(v)) &&
            tuer &&
            platz &&
            auto.typ.toLowerCase().match(this.typ.toLowerCase()) &&
            co2 &&
            verbrauch &&
            auto.kraftstoff.toLowerCase().match(this.kraftstoff.toLowerCase()) &&
            auto.tankvolumen >= this.tankvolumen &&
            auto.leistung >= this.leistung &&
            auto.preis >= this.preis_min &&
            max &&
            auto.getriebe.toLowerCase().match(this.getriebe.toLowerCase())
            && zeit
        );
      });
      if (this.autoname == "") {
        this.msg = "Alle Autos";
      } else {
        this.msg = this.autoname;
      }
    },

    //Filter, um Autos zu finden, deren Buchungsdaten sich mit dem gesuchten Zeitraum überschneiden
    zeitFilter(auto) {
      let index = 0
      let gefunden = false
      let i = 0
      let buchung = ''
      let startdatum = new Date(this.start)
      let enddatum = new Date(this.ende)
      if ((this.start == '' && this.ende == '') || (startdatum.getTime() > enddatum.getTime())) {
        return true
      }
      for (; i < this.zeiten.length; i++) {
        if (this.zeiten[i].auto == auto.name) {
          index = i
          gefunden = true
          break
        }
      }
      if (!gefunden) {

        return true
      }
      for (buchung of this.zeiten[index].times) {
        let von = new Date(buchung.from)
        let bis = new Date(buchung.to)
        if (this.start == '') {
          if ((enddatum.getTime() >= von.getTime()) || (enddatum.getTime() >= bis.getTime())) {
            return false
          }
        } else if (this.ende == '') {
          if ((startdatum.getTime() <= von.getTime()) || (startdatum.getTime() <= bis.getTime())) {
            return false
          }
        } else {
          if (((startdatum.getTime() <= von.getTime()) && (enddatum.getTime() >= von.getTime())
              || ((startdatum.getTime() <= bis.getTime()) && (enddatum.getTime() >= bis.getTime()))
              || ((startdatum.getTime() >= von.getTime()) && (enddatum.getTime() <= bis.getTime())))) {
            return false
          }
        }
      }
      return true
    },
    mieten(autoname) {
      this.ausgewaehlt = true;
      this.gewaehltesauto = this.autos.find(
          (element) => element.name == autoname
      );
      this.$router.push("/search/" + autoname);
    },
    verfuegbarkeit(vorhanden) {
      if (vorhanden == 1) {
        return true;
      } else {
        return false;
      }
    },


    buchen() {
      this.$router.push("/rent/" + this.gewaehltesauto.name);
      //request an backend, um buchung abzuschließen
      //dazu in db eine bestellung erstellt werden
      //employee kann es dann abrufen in account

    },
    back() {
      this.ausgewaehlt = false;
      this.ladeAutos();
      this.$router.push("/search");
    }
  },

  beforeMount() {
    let from = new Date()
    let to = new Date();
    from.setDate(from.getDate() + 1) // kann nicht am selben Tag buchen
    to.setDate(to.getDate() + 90) //max. 3 Monate in Zukunft buchen
    //Zeiträume für Start-und Endkalender festlegen
    this.datepickerSetting.value = Helper.formatDate(from)
    this.datepickerSetting.from = Helper.formatDate(from)
    this.datepickerSetting.to = Helper.formatDate(to)
    this.datepickerSetting2.from = Helper.formatDate(from)
    this.datepickerSetting2.to = Helper.formatDate(to)
    this.kraftstofftypen = ["Super", "Super Plus", "Diesel"];
    this.autotypen = ["SUV", "Kleinwagen", "Van", "Coupe"];
    this.getriebetypen = ["Automatik", "Schaltung"];
    if (this.$route.params.autoname != "") {
      this.ausgewaehlt = true;
      UserService.getCar(this.$route.params.autoname)
          .then((response) => {
            this.gewaehltesauto = response.data.car;
          })
          .catch((error) => {
            Helper.handle(error);
            this.ausgewaehlt = false;
            this.msg = "";
            Helper.redirect("/search");
          });
    } else {
      this.ausgewaehlt = false;
      this.ladeAutos();
    }
  }
})
</script>


<style lang="scss" scoped>

.search {
  width: 100%;
}
.search-result{
  .description{
    font-size: 2em;
  }
  .actions{
    display: flex;
    justify-content: space-between;
  }
}


</style>