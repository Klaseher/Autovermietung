<template>
  <div class="administrator container">
    <h1>{{adminmessage}}</h1>
    <hr>
    <div class="text-center form-group">
      <button class="btn-primary btn" v-on:click="zeigeBestellungen()">
        Bestellungen verwalten
      </button>
    </div>

    <!-- Wenn Admin, dann werden hier zusätzliche Adminelemente geladen  -->

    <div v-if="admin || employee" class="form-group">
      <div class="text-center">
        <button class="btn btn-primary" v-on:click="seen = !seen">
          Admin-Funktionen
        </button>
      </div>
    </div>
    <hr>


    <!-- Anzeigen der Adminfunktionen -->
    <div v-if="seen" class="form-group">
      <p class="text-center">In diesem Bereich können Mitarbeiter- Kunden- sowie Autodaten verwaltet und bearbeitet
        werden.</p>
      <div class="actions form-group">
        <button class="btn btn-primary" type="submit" @click="showEmployees" v-if="admin">
          Mitarbeiterübersicht
        </button>

        <button class="btn btn-primary" type="submit" @click="showCustomers" v-if="admin || employee">
          Kundenübersicht
        </button>
        <button class="btn btn-primary" type="submit" @click="showCars" v-if="admin">
          Autoübersicht
        </button>
      </div>
      <div>
        <!-- Anzeigen aller Mitarbeiter + Auswählen zum Bearbeiten -->
        <div v-if="editEmployee" class="table-responsive">
          <div class="form-group">
            <button class="btn btn-success" @click="createEmployee()">Neuen Mitarbeiter anlegen</button>
          </div>
          <table class="table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Benutzername</th>
              <th>Daten bearbeiten</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(employee, index) in employees" :key="index">
              <td>{{ employee.nachname }}</td>
              <td>{{ employee.user }}</td>
              <td>
                <button class="btn btn-primary" @click="editingEmployee(employee.id)">Daten bearbeiten</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editUser" class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Benutzername</th>
              <th>Daten bearbeiten</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(customer, index) in customers" :key="index">
              <td>{{ customer.nachname }}</td>
              <td>{{ customer.user }}</td>
              <td>
                <button class="btn btn-primary" @click="editingCustomer(customer.id)">Daten bearbeiten</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="table-responsive" v-if="editCar">
          <div class="form-group">
            <button class="btn btn-success" @click="createCar()">Neues Auto erstellen</button>
          </div>
          <table class="table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Photo</th>
              <th>Bearbeiten</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(car, index) in cars" :key="index">
              <td>{{ car.name }}</td>
              <td>
                <div class="img-preview" v-if="car.image">
                  <img v-bind:src="`${getImageUrl(car.image)}`" v-bind:alt="`${car.image.originalname}`">
                </div>
              </td>
              <td>
                <button class="btn btn-primary" @click="editingCar(car.name)">Bearbeiten</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">In diesem Bereich können Sie auf erweiterte Administrator Funktionen zugreifen</p>
    </div>
  </div>
</template>

<script>
//Komponente für Mitarbeiter/Admin
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
import fileService from "@/services/file.service";

export default {
  data() {
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
      employee: false,
      seen: false,
      editEmployee: false,
      editCar: false,
      employees: [], //Alle Mitarbeiter
      cars: [],
      customers: [],
      getriebe: '',
      editUser: false,
      adminmessage: ''
    }
  },
  methods: {
    getImageUrl(image) {
      return fileService.getImageUrl(image)
    },
    zeigeBestellungen() {
      this.$router.push('/admin/bestellungen')
    },

    //laden aller Mitarbeiter aus Backend

    showEmployees() {
      this.editEmployee = !this.editEmployee
      this.editCar = false;
      this.editUser = false;
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
    showCustomers() {
      this.editUser = !this.editUser
      this.editCar = false;
      this.editEmployee = false;
      if (this.editUser) {
        UserService.getCustomers()
            .then(response => {
              this.customers.push.apply(this.customers, response.data.customers)
            })
            .catch((error) => Helper.handle(error))
      } else {
        this.customers = []
      }
    },
    showCars() {
      this.editCar = !this.editCar
      this.editEmployee = false;
      this.editUser = false;
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
    createEmployee() {
      this.$router.push('/admin/newEmployee')
    },
    //Pfad auf detaillierte Mitarbeiteranzeige ändern
    editingEmployee(id) {
      this.$router.push('/admin/editEmployee/' + id)
    },
    editingCustomer(id) {
      this.$router.push('/admin/editCustomer/' + id)
    },
    createCar() {
      this.$router.push('/admin/newCar')
    },
    editingCar(name) {
      this.$router.push('/admin/editCar/' + name)
    },
    redirect(route) {
      Helper.redirect(route)
    }
  },
  beforeMount() {
    let role = sessionStorage.getItem('role')
    if (role == 1) {
      this.adminmessage = "Sie sind als Mitarbeiter angemeldet"
      this.admin = false
      this.employee = true;
    } else if (role == 2) {
      this.admin = true;
      this.employee = false;
      this.adminmessage = "Sie sind als Administrator angemeldet"
    }

  },
  mounted() {
    const tab = this.$route.params.tab;
    if(tab){
      switch (tab){
        case 'cars': {
          this.seen = true;
          this.showCars();
          break;
        }
        case 'employees': {
          this.seen = true;
          this.showEmployees();
          break;
        }
        case 'customers': {
          this.seen = true;
          this.showCustomers();
          break;
        }
      }
    }
  }
}
</script>
<style scoped>

</style>
