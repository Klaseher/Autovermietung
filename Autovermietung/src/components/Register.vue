<template>
    <div>
        <h4>Register</h4>
        <form>
            <label for="name">Name</label>
            <div>
                <input id="name" type="text" v-model="name" required autofocus>
            </div>

            <label for="email" >E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
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
                 <button type="cancel" @click="back">
                    Go back
                 </button>   
                  <button type="submit" @click="handleSubmit">
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props : ["nextUrl"],
        data(){
            return {
                name : "",
                email : "",
                password : "",
                password_confirmation : "",
                is_admin : null
            }
        },
        methods : {

             back(){
                this.$router.push("/")
            },
            handleSubmit(e) {
                e.preventDefault()
                var nameTest = new RegExp("^[a-zA-Z]+$");
                var passTest = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                var mail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
                if(this.name.length > 5 && this.name.length < 100 && nameTest.test(this.name)){
                    if(mail.test(this.email) && this.email.length < 100){
                        if (this.password === this.password_confirmation && this.password.length > 0 && this.password.length < 100)
                            {  if(passTest.test(this.password)){
                                let url = "http://localhost:3000/register"
                                this.$http.post(url, {
                                    name: this.name,
                                    email: this.email,
                                    password: this.password
                                })
                                .then(response => {
                                        this.$router.push('/')
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
                        this.email = ""
                        return alert("Invalid Email format")
                    }
                }
                 else{
                        this.name = ""
                        return alert("Name too long or short")
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
        }
    }
</script>