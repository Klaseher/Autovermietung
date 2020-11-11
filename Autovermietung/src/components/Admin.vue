<template>
    <div class="hello">
        <div v-if="admin">
              <div v-on:click="seen = !seen" class="control">
                <button>
                    Admin-Functions
                </button>
              </div>
        </div>
         <button type="submit"  @click="redirect('/')">
                    Home
        </button>
        <button type="submit" @click="logout">
                    Logout
        </button>
        <h1>Welcome to Employee page</h1>
        <h2>{{msg}}</h2>
        <div v-if="seen">
                <p>Admin-Functions can be accessed from here</p>
                <form>
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
                        <input id="password" type="password" v-model="password" required>
                    </div>
                <label for="password-confirm">Confirm Password</label>
                <div>
                    <input id="password-confirm" type="password" v-model="password_confirmation" required>
                </div>
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
            <div>
                <button type="submit" @click="showEmployees">
                        Show all Employees
                </button>
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
            </div>
        </div>
        <div v-else>
            <p>Employee-Functions can be accessed from here</p>
        </div>
    </div>
</template>

<script>
/* eslint-disable eqeqeq */
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
import Auth from '../services/auth.service'
export default {
  data () {
    return {
      name: '',
      username: '',
      password: '',
      password_confirmation: '',
      msg: 'The superheros',
      created: '',
      content: '',
      admin: false,
      seen: false,
      editEmployee: false,
      employees: []
    }
  },
  methods: {
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
    editingEmployee (id) {
      this.$router.push('/admin/editEmployee/' + id)
    },
    logout () {
      Auth.logout()
    },

    redirect (route) {
      Helper.redirect(route)
    },
    handleSubmit (e) {
      e.preventDefault()
      /* Regex Name
        Multiple letters containing ' , or whitespace but not two after each other */
      var nameTest = new RegExp("^[a-zA-Z]+(([', ][a-zA-Z ])?[a-zA-Z]*)*$")
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
      if (this.name.length > 2 && this.name.length < 100 && nameTest.test(this.name)) {
        if (this.username.length > 5 && this.username.length < 100 && userTest.test(this.username)) {
          if (this.password == this.password_confirmation && this.password.length > 0 && this.password.length < 100) {
            if (passTest.test(this.password)) {
              Auth.registerEmployee(this.name, this.username, this.password)
                .then(response => {
                  alert(response.data)
                  this.created = 'User successfully created'
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
        return alert('Name invalid')
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
    h1, h2 {
        font-weight: normal;
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
</style>
