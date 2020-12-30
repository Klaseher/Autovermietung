<template>
  <div class="container">
    <h1>Edit Employee</h1>
    <hr>
    <div class="form-group">
      <form>
        <div class="form-group">
          <label for="name"><b>Employee Last Name:</b> {{ name }}</label>
        </div>
        <div  class="form-inline">
        <div class="form-group">
          <input class="form-control" id="name" type="text" v-model="new_name" required autofocus>
        </div>
        <div class="form-group mx-sm-3">
          <button class="btn btn-primary" type="button" @click="updateName">
            Change Last Name
          </button>
        </div>
        </div>
      </form>
    </div>

    <div class="form-group">
      <form >
        <div class="form-group">
          <label for="username">Current Username: {{ username }} </label>
        </div>
        <div class="form-inline">
        <div class="form-group">
          <input class="form-control" id="username" type="email" v-model="new_username" required autofocus>
        </div>
        <div class="form-group mx-sm-3">
          <button type="button" @click="updateUsername" class="btn btn-primary">
            Change Username
          </button>
        </div>
        </div>
      </form>
    </div>
    <div class="form-group">
      <form>
        <div class="form-group">
          <label for="password">New Password</label>
          <input class="form-control" id="password" type="password" v-model="password" required>
        </div>
        <div class="form-group">
          <label for="password">Confirm Password</label>
          <input class="form-control" id="new_password" type="password" v-model="new_password" required>
        </div>
        <div class="form-group">
          <button class="btn btn-primary" type="button" @click="changePassword">
            Change Password
          </button>
        </div>
      </form>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" type="cancel" @click="back">
        Go back
      </button>
      <button class="btn btn-danger" type="button" @click="deleteEmployee">
        Delete
      </button>
    </div>
    <h2 class="text-center">{{ meldung }}</h2>
  </div>
</template>

<script>
//Komponente zum Bearbeiten von Mitarbeiter-Konto durch Admin
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
    //Methoden zum Ändern der jeweiligen Attribute von Mitarbeiter
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
              if(response)

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
    //Methode zum Löschen von Mitarbeiter-Account
    deleteEmployee () {
      if (confirm('Do you really want to delete the Employee account?')) {
        Auth.deleteEmployee(this.id)
          .then(response => {
            if(response)
            
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
<style  scoped>

</style>
