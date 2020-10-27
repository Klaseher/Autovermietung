<template>
    <div class="hello">
      <div v-if="!loggedin">
        <button type="submit" @click="redirect('/register')">
                      Register
          </button>
        </div>
        <button type="submit" @click="redirect('/login')">
                    {{login}}
          </button>
        <h1>This is the super dope Homepage</h1>
        <h2>{{msg}}</h2>
    </div>
</template>


<script>
import UserService from '../services/user.service';
  
  
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to CarSharing XXXTREMEXXX',
      login : 'Login',
      loggedin: false
    }
  },
      methods : {
            redirect(route){
              if(!this.loggedin){
               UserService.testToken().then(
                response => {
                  if(response.data.role != null && response.data.auth != null){
                    sessionStorage.setItem('role',JSON.stringify(response.data.role))
                    sessionStorage.setItem('auth',response.data.auth)
                     this.$router.push(route)
                  }
                },
                error => {
                  this.$router.push(route)
                })
              }
              else{
              this.$router.push(route)
              }
            },
            changeValue(){
               if(sessionStorage.getItem('auth') == 'true'){
                      this.loggedin = true
                      this.login = "Your Account"
                 }
                 else{
                   this.loggedin = false
                   this.login = "Login"
                 }
            }         
        },
    beforeMount(){
      this.changeValue()
 }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
