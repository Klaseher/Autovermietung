<template>
    <div>
        <h4>Edit Employee</h4>
        <form>
            <label for="name">Employee Name: {{name}}</label>
            <div>
                <input id="name" type="text" v-model="new_name" required autofocus>
            </div>
            <button type="submit" @click="updateName">
                    Change Name
            </button>
        </form>
         <form>
            <label for="email">Current Username: {{username}} </label>
            <div>
                <input id="username" type="email" v-model="new_username" required autofocus>
            </div>
            <button type="submit" @click="updateUsername">
                    Change Username
            </button>
        </form>
         <form>
             <label for="password">Old Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <label for="password">New Password</label>
            <div>
                <input id="new_password" type="password" v-model="new_password" required>
            </div>
            <button type="submit" @click="changePassword">
                    Change Password
            </button>
        </form>
        <button type="cancel" @click="back">
                 Go back
        </button>
        <button type="submit" @click="deleteEmployee">
                  Delete Employee Account
        </button>
        <h1>{{meldung}}</h1>
    </div>
</template>

<script>
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
      if (this.new_name.length > 5 && this.new_name.length < 100 && nameTest.test(this.new_name)) {
        //bug
        Auth.updateEmployee(this.id, this.new_name, null, null, null)
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
        this.name = ''
        return alert('Name invalid')
      }
    },
    updateUsername () {

    },
    changePassword () {

    },
    deleteEmployee () {

    }
  },
  beforeMount () {
    if (this.$route.params.username != null) {
      UserService.getEmployee(this.$route.params.username)
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
