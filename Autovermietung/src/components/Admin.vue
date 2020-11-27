<template>
    <div class="administrator">
      <!-- Wenn Admin, dann werden hier zusätzliche Adminelemente geladen  -->
        <div v-if="admin">
              <div v-on:click="seen = !seen" class="control">
                <button>
                    Admin-Functions
                </button>
              </div>
        </div>
        <h1>{{msg}}</h1>
        
         <!-- Anzeigen der Adminfunktionen -->
        <div v-if="seen">
                <p>Admin-Functions can be accessed from here</p>
                <form>
                    <label for="vorname">Vorname</label>
                    <div>
                      <input id="vorname" type="text" v-model="vorname" required autofocus>
                    </div>
                    <label for="name">Name</label>
                    <div>
                      <input id="name" type="text" v-model="name" required autofocus>
                    </div>
                    <label for="username">Username</label>
                    <div>
                      <input id="username" type="text" v-model="username" required autofocus>
                    </div>
                    

                    <label for="password">Password</label>
                    <div>
                      <input id="password" type="password" v-model="password" required autofocus>
                    </div>
                    <label for="password-confirm">Confirm Password</label>
                    <div>
                        <input id="password-confirm" type="password" v-model="password_confirmation" required autofocus>
                    </div>
                    <br/>
                <div>
                    <button type="cancel">
                        Cancel
                    </button>
                    <button type="submit" @click="handleSubmit">
                        Create new Employee
                    </button>
                </div>
            </form>
            <div>
            <h3 style="color:#00FF00">{{created}}</h3>
             </div>
            <div class="grid-container">
                <button type="submit" @click="showEmployees">
                        Show all Employees
                </button>
                <br/>
                <br/>
                 <!-- Anzeigen aller Mitarbeiter + Auswählen zum Bearbeiten -->
                <table v-if="editEmployee">
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
                            <td><button @click="editingEmployee(employee.id)">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <br/>
            </div>
        </div>
        <div v-else>
            <p>Employee-Functions can be accessed from here</p>
        </div>
    </div>
</template>

<script>
//Komponente für Mitarbeiter/Admin
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
import Auth from '../services/auth.service'
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
      employees: [] //Alle Mitarbeiter
    }
  },
  methods: {
    //laden aller Mitarbeiter aus Backend
    showEmployees () {
      this.editEmployee = !this.editEmployee
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
    //Pfad auf detaillierte Mitarbeiteranzeige ändern
    editingEmployee (id) {
      this.$router.push('/admin/editEmployee/' + id)
    },
    redirect (route) {
      Helper.redirect(route)
    },
    //Registrieren neuer Mitarbeiter
    handleSubmit (e) {
      e.preventDefault()
      var vornameTest = new RegExp('([a-zA-Z]{3,100}\\s*)+')
      var nameTest = new RegExp('[a-zA-Z]{3,100}')
      /* Regex: Strong Password
      Special Characters - Not Allowed
      Spaces - Not Allowed
      Minimum and Maximum Length of field - 6 to 12 Characters
      Met by [a-zA-Z0-9@]{6,12}
      Numeric Character - At least one character
      Met by positive lookahead (?=.*\d)
      At least one Capital Letter
      Met by positive lookahead (?=.*[A-Z])
      Repetitive Characters - Allowed only two repetitive characters */
      var userTest = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$')
      var passTest = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$')
        if (this.name.length > 2 && this.name.length < 100 && nameTest.test(this.name) && this.vorname.length > 2 && this.vorname.length < 100 && vornameTest.test(this.vorname)) {
         if (this.username.length > 5 && this.username.length < 100 && userTest.test(this.username)) {
          if (this.password == this.password_confirmation && this.password.length > 0 && this.password.length < 100) {
            if (passTest.test(this.password)) {
              Auth.registerEmployee(this.name, this.vorname, this.username, this.password)
                .then(response => {
                  alert(response.data)
                  this.created = 'User successfully created'
                  this.vorname = ''
                  this.name = ''
                  this.username = ''
                  this.password = ''
                  this.password_confirmation = ''
                })
                .catch((error) => Helper.handle(error))
            } else {
              this.password = ''
              this.password_confirmation = ''

              return alert('Passwords not safe enough')
            }
          } else {
            this.password = ''
            this.password_confirmation = ''

            return alert('Password is do not match')
          }
        } else {
          this.username = ''
          return alert('Username not save enough (6-12 Characters + 1x uppercase + 1x Number)')
        }
      } else {
        this.name = ''
        this.vorname = ''
        return alert('Name too long or short or contains invalid symbols')
      }
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
  background: lightblue;
  
}
h1 {
  
  font-weight:bold;
  color: mediumblue;
  padding:20px;
  text-align: center;
        
  font-size: 30px;
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
button{
  box-shadow: 0px 0px 0px 2px #9fb4f2;
	background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
	background-color:#7892c2;
	border-radius:10px;
	border:1px solid #4e6096;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:14px;
	padding:20px 37px 20px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center;
  width: 20%;
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
