<template>
    <div>
        <h4>Edit Employee</h4>
        <form>
            <label for="name">Employee Name: {{name}}</label>
            <div>
                <input id="name" type="text" v-model="new_name" required autofocus>
            </div>
            <button type="button" @click="updateName">
                    Change Name
            </button>
        </form>
         <form>
            <label for="email">Current Username: {{username}} </label>
            <div>
                <input id="username" type="email" v-model="new_username" required autofocus>
            </div>
            <button type="button" @click="updateUsername">
                    Change Username
            </button>
        </form>
         <form>
             <label for="password">New Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <label for="password">Confirm Password</label>
            <div>
                <input id="new_password" type="password" v-model="new_password" required>
            </div>
            <button type="button" @click="changePassword">
                    Change Password
            </button>
        </form>
        <button type="cancel" @click="back">
                 Go back
        </button>
        <button type="button" @click="deleteEmployee">
                  Delete Employee Account
        </button>
        <h1>{{meldung}}</h1>
    </div>
</template>

<script>
/* eslint-disable eqeqeq */
import UserService from '../services/user.service'
import Auth from '../services/auth.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      meldung: '',
      name: '',
      username: '',
      password: '',
      id: -1,
      new_name: '',
      new_username: '',
      new_password: ''
    }
  },
  methods: {
    back () {
      this.$router.push('../')
    },
    updateName () {
      var nameTest = new RegExp("^[a-zA-Z]+(([', ][a-zA-Z ])?[a-zA-Z]*)*$")
      if (this.new_name.length > 5 && this.new_name.length < 100 && this.new_name != this.name && nameTest.test(this.new_name)) {
        Auth.updateEmployee(this.id, this.new_name, null, null)
          .then(response => {
            this.meldung = 'Employee Name successfully updated'
            this.name = response.data.name
            this.new_name = ''
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/admin')
          })
      } else {
        this.new_name = ''
        return alert('Name invalid')
      }
    },
    updateUsername () {
      var userTest = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$')
      if (this.new_username.length > 6 && this.new_username.length < 100 && this.new_username != this.username && userTest.test(this.new_username)) {
        Auth.updateEmployee(this.id, null, this.new_username, null)
          .then(response => {
            this.meldung = 'Employee Username successfully updated'
            this.username = response.data.username
            this.new_username = ''
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/admin')
          })
      } else {
        this.new_username = ''
        return alert('Username invalid')
      }
    },
    changePassword () {
      var passTest = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$')
      if (this.password == this.new_password) {
        if (passTest.test(this.new_password) && this.new_password.length > 0 && this.new_password.length < 100) {
          Auth.updateEmployee(this.id, null, null, this.new_password)
            .then(response => {
              this.meldung = 'Employee Password successfully updated'
              this.password = ''
              this.new_password = ''
            })
            .catch((error) => {
              Helper.handle(error)
              Helper.redirect('/admin')
            })
        } else {
          this.password = ''
          this.new_password = ''
          return alert('Password is not safe enough')
        }
      } else {
        this.password = ''
        this.new_password = ''

        return alert('Passwords do not match')
      }
    },
    deleteEmployee () {
      if (confirm('Do you really want to delete the Employee account?')) {
        Auth.deleteEmployee(this.id)
          .then(response => {
            alert('Employee account successfully deleted')
            Helper.redirect('/admin')
          })
          .catch((error) => {
            Helper.handle(error)
            Helper.redirect('/admin')
          })
      } else {
        this.meldung = ''
      }
    }
  },
  beforeMount () {
    if (this.$route.params.id != null) {
      UserService.getEmployee(this.$route.params.id)
        .then(response => {
          this.id = response.data.employee.id
          this.name = response.data.employee.name
          this.username = response.data.employee.email
        })
        .catch((error) => {
          Helper.handle(error)
          Helper.redirect('/admin')
        })
    } else {
      Helper.redirect('/admin')
    }
  }
}
</script>
