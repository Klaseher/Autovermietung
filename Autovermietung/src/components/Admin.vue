<template>
  <div class="administrator container">
    <h1>{{ msg }}</h1>
    <hr>
    <div class="text-center form-group">
      <button class="btn-primary btn" v-on:click="zeigeBestellungen()">
        Bestellungen
      </button>
    </div>

    <!-- Wenn Admin, dann werden hier zusätzliche Adminelemente geladen  -->

    <div v-if="admin" class="form-group">
      <div class="text-center">
        <button class="btn btn-primary" v-on:click="seen = !seen">
          Admin-Functions
        </button>
      </div>
    </div>
    <hr>


    <!-- Anzeigen der Adminfunktionen -->
    <div v-if="seen" class="form-group">
      <p class="text-center">Admin-Functions can be accessed from here</p>
      <div class="actions form-group">
        <button class="btn btn-primary" type="submit" @click="showEmployees">
          Show all Employees
        </button>

        <button class="btn btn-primary" type="submit" @click="showCustomers">
          Show all Customers
        </button>
        <button class="btn btn-primary" type="submit" @click="showCars">
          Show all Cars
        </button>
      </div>
      <div>
        <!-- Anzeigen aller Mitarbeiter + Auswählen zum Bearbeiten -->
        <div v-if="editEmployee" class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(employee, index) in employees" :key="index">
              <td>{{ employee.nachname }}</td>
              <td>{{ employee.user }}</td>
              <td>
                <button class="btn btn-primary" @click="editingEmployee(employee.id)">Edit</button>
              </td>
            </tr>
            </tbody>
          </table>
          <button class="btn btn-success" @click="createEmployee()">Create New Employee</button>
        </div>

        <div class="table-responsive" v-if="editCar">
          <table class="table">
            <thead>
            <tr>
              <th>Name</th>
              <!--
              <th>Typ</th>
              <th>Türen</th>
              <th>Sitplätze</th>
              <th>Kraftstoff</th>
              <th>Verbrauch</th>
              <th>Leistung</th>
              <th>Tankvolume</th>
              <th>CO2</th>
              <th>Getriebe</th>
              <th>Modell</th>
              <th>Preis</th>
              <!-->
              <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(car, index) in cars" :key="index">
              <td>{{ car.name }}</td>
              <td>
                <button class="btn btn-primary" @click="editingCar(car.name)">Edit</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Employee-Functions can be accessed from here</p>
    </div>
  </div>
</template>

<script>
//Komponente für Mitarbeiter/Admin
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      vorname: '',
      name: '',
      username: '',
      password: '',
      password_confirmation: '',
      msg: 'HEYRJP GmbH',
      created: '',
      content: '',
      admin: false, //speichern, ob Mitarbeiter Admin ist
      seen: false,
      editEmployee: false,
      editCar: false,
      employees: [], //Alle Mitarbeiter
      cars:[],
      getriebe:''
    }
  },
  methods: {

    zeigeBestellungen(){
       this.$router.push('/admin/bestellungen')
    },

    //laden aller Mitarbeiter aus Backend

    showEmployees () {
      this.editEmployee = !this.editEmployee
      this.editCar = false;
      if (this.editEmployee) {
        UserService.getEmployee(-200)
          .then(response => {
            this.employees.push.apply(this.employees, response.data.employees)
          })
          .catch((error) => Helper.handle(error))
      } else {
        this.employees = []
      }
    },
    showCustomers () {
     
    },
    showCars () {
      this.editCar = !this.editCar
      this.editEmployee = false;
      if (this.editCar) {
        UserService.getCar('alle')
          .then(response => {
            this.cars.push.apply(this.cars, response.data.cars)
          })
          .catch((error) => Helper.handle(error))
      } else {
        this.cars = []
      }
    },
    //Pfad auf detaillierte Mitarbeiteranzeige erneuern
    createEmployee(){
      this.$router.push('/admin/newEmployee')
    },
    //Pfad auf detaillierte Mitarbeiteranzeige ändern
    editingEmployee (id) {
      this.$router.push('/admin/editEmployee/' + id)
    },

    editingCar () {
      
    },
    redirect (route) {
      Helper.redirect(route)
    }
  },
  beforeMount () {
    let role = sessionStorage.getItem('role')
    if (role == 1) {
      this.admin = false
    } else if (role == 2) {
      this.admin = true
    }
  }
}
</script>
<style scoped>

</style>
