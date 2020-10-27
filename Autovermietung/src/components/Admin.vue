<template>
    <div class="hello">
        <div v-if="admin">
              <div v-on:click="seen = !seen" class="control">
                <button>
                    Admin-Functions
                </button>
              </div> 
        </div>
         <button type="submit" @click="logout">
                    Logout
        </button>
        <h1>Welcome to Employee page</h1>
        <h2>{{msg}}</h2>        
        <div v-if="seen">
                <p>Admin-Functions can be accessed from here</p>
                <form>
                <label for="name">Username</label>
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
            </div>
        </div>
        <div v-else>
            <p>Employee-Functions can be accessed from here</p>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                username: "",
                password: "",
                password_confirmation : "",
                msg: 'The superheros',
                created: "",
                admin : false,
                seen: false,
                content: ""
            }
        },
           methods : {
            logout(){
               sessionStorage.removeItem('role');
               sessionStorage.removeItem('auth');
               this.$router.push("/")
           },

           showEmployees(){

           },
           handleSubmit(e) {
                e.preventDefault()
                var userTest = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$");
                var passTest = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?!.*(.)\\1\\1)[a-zA-Z0-9@]{6,12}$");
                if(this.username.length > 6 && this.username.length < 100 && userTest.test(this.username)){
                        if (this.password === this.password_confirmation && this.password.length > 0 && this.password.length < 100)
                            {  if(passTest.test(this.password)){
                                let url = "http://localhost:3000/register-employee"
                                this.$http.post(url, {
                                    username: this.username,
                                    password: this.password,

                                })
                                .then(response => {
                                    this.created = "User successfully created"
                                    this.username = ""
                                    this.password = ""
                                    this.password_confirmation = "" 
                                })
                                .catch((error) => this.handle(error));
                            }
                            else{
                                this.password = ""
                                this.password_confirmation = ""

                            return alert("Passwords not safe enough")
                            }
                        } else {
                            this.password = ""
                            this.password_confirmation = ""

                            return alert("Passwords do not match")
                        }
                    }
                 else{
                        this.username = ""
                        return alert("Username not save enough (Min. 6 Characters + 1x uppercase + 1x Number)")
                    }
            },

             handle (error) {
	       
                if (error.response.data) {

                    if(error.response.status == 500){
                        return alert(error.response.data);
                    }

                    else if (typeof error.response.data == 'string') {
                    
                        return alert('There is a problem with your credentials');
                    }

                }

                return alert('We could not handle your request');
                }
        },
         beforeMount(){
              let role = sessionStorage.getItem('role')   
                if(role == 1){
                        this.admin = false
                }
                else if(role == 2){
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