<template>
<h1>{{msg}}</h1>
    <div class="administrator">
    
        <br/>
        <br/>

       <div v-on:click="zeigeBestellungen()" class="control">
                <button class="button btn">
                    Bestellungen verwalten
                </button>
        </div>
        <br/>

      <!-- Wenn Admin, dann werden hier zusätzliche Adminelemente geladen  -->

        <div v-if="admin">
              <div v-on:click="seen = !seen" class="control">
                <button class="button btn" >
                    Admin Funktionen
                </button>
              </div>
        </div>        
         <!-- Anzeigen der Adminfunktionen -->
        <div v-if="seen">
            <br/>
            <div class="grid-container">
                <button class="button btn" type="submit" @click="showEmployees">
                        Alle Mitarbeiter anzeigen
                        
                </button>
                

                <button class="button btn" type="submit" @click="showCustomers">
                        Alle Kunden anzeigen
                </button>
                <button class="button btn" type="submit" @click="showCars">
                        Alle Fahrzeuge anzeigen
                </button>
                
                <br/>
                <br/>
                 <!-- Anzeigen aller Mitarbeiter + Auswählen zum Bearbeiten -->
                <div v-if="editEmployee">
                  <table >                                    
                      <thead>  
                          <tr>                            
                              <th>Name</th>
                              <th>Username</th>
                              <th>Edit</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(employee, index) in employees" :key="index">
                              <td>{{employee.nachname}}</td>
                              <td>{{employee.user}}</td>
                              <td><button @click="editingEmployee(employee.id)">Bearbeiten</button></td>
                          </tr>
                      </tbody>
                  </table>
                  <button  @click="createEmployee()">Neuen Mitarbeiter anlegen</button>     
                </div>  
                <br/>
                <br/>
                
                <table v-if="editCars">
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
                            <td>{{car.name}}</td>
                            <td><button @click="editingCar(car.name)">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else>
        <br/>
        <br/>
        </div>
    </div>
</template>

<script>
//Komponente für Mitarbeiter/Admin
//import UserService from '../services/user.service'
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
      this.$router.push('/admin/func/showEmployee')
      // this.editEmployee = !this.editEmployee
      // if (this.editEmployee) {
      //   UserService.getEmployee(-200)
      //     .then(response => {
      //       this.employees.push.apply(this.employees, response.data.employees)
      //     })
      //     .catch((error) => Helper.handle(error))
      // } else {
      //   this.employees = []
      // }
    },
    showCustomers () {
     this.$router.push('/admin/func/showCus')
    },
    showCars () {
      this.$router.push('/admin/func/showCar')
      // this.editCar = !this.editCar
      // if (this.editCar) {
      //   UserService.getCar('alle')
      //     .then(response => {
      //       this.cars.push.apply(this.cars, response.data.cars)
      //     })
      //     .catch((error) => Helper.handle(error))
      // } else {
      //   this.cars = []
      // }
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

.administrator{


  background:#443dac;
  
}
h1 {
  
  font-weight:bold;
  color: mediumblue;
  padding:20px;
  text-align: center;
        
  font-size: 30px;
  }

h3{
  color:#00FF00;
  }
input, select {
  width: 30%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.button{
  margin: 10px 10px;
  box-shadow: 0px 0px 0px 2px #9fb4f2;
	background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
	background-color:#7892c2;
	border-radius:10px;
	border:1px solid #4e6096;
  padding:16px 32px;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:14px;
	padding:20px 40px 20px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center;
  width: 20%;
}
.btn:hover {
  background-color: #96b428;
  color: rgb(26, 12, 12);
}
label{
  color:indigo;
}
ul {
  list-style-type: none;
   padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  border-spacing: 5px;
  width: 100%;
}
</style>
