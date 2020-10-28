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
    </div>
</template>

<script>
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      name: '',
      username: '',
      password: '',
      employee: null,
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
          this.employee = response.data.employee
          this.name = response.data.employee.name
          this.username = response.data.employee.email
        })
        .catch((error) => Helper.handle(error))
    } else {
      this.$router.push('/admin')
    }
  }
}
</script>
