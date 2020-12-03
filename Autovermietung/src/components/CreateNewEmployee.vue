<template>
    <div class="newEmployee">
        <h4>New Employee</h4>
        <form>
            <label for="name"> New Employee Last Name</label>
            <div>
                <input id="name" type="text" v-model="new_name" required autofocus>
            </div>
            <button type="button" @click="updateName">
                     Last Name
            </button>
        </form>
         <form>
            <label for="email"> Username:  </label>
            <div>
                <input id="username" type="email" v-model="new_username" required autofocus>
            </div>
            <button type="button" @click="updateUsername">
                     Username
            </button>
        </form>
         <form>
             <label for="password"> Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <label for="password">Confirm Password</label>
            <div>
                <input id="new_password" type="password" v-model="new_password" required>
            </div>
            <button type="button" @click="confirmPassword">
                    Confirm Password
            </button>
        </form>
        <button type="cancel" @click="back">
                 Go back
        </button>
        <button type="button" @click="deleteEmployee">
                  Delete 
        </button>
        <h1>{{meldung}}</h1>
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
    confirmPassword () {
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
.newEmployee{
  background:lightblue;
  padding:10%
  
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
