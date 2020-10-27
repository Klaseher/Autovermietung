<template>
    <div>
        <h4>Login</h4>
        <form>
            <label for="email">E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="password" >Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                 <button type="cancel" @click="back">
                    Go back
                </button>
                 <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
        <h3 style="color:#FF0000">{{msg}}</h3>
    </div>
</template>


<script>

    export default {
        data(){
            return {
                email : "",
                password : "",
                msg : ""
            }
        },
        methods : {

            back(){
                this.$router.push("/")
            },
            handleSubmit(e){
                e.preventDefault()
                if (this.password.length > 0) {
                    this.$http.post('http://localhost:3000/login', {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {

                        let is_admin = response.data.role
                        sessionStorage.setItem('role',JSON.stringify(response.data.role))
                        sessionStorage.setItem('auth',response.data.auth)

                        if (sessionStorage.getItem('auth') == 'true'){
                            this.$emit('loggedIn')
                            if(this.$route.params.nextUrl != null){
                                this.$router.push(this.$route.params.nextUrl)
                            }
                            else {
                                if(is_admin >= 1){
                                    this.$router.push('admin')
                                }
                                else {
                                    this.$router.push('dashboard')
                                }
                            }
                        }
                    })
                    .catch((error) => this.handle(error));
                }
            },
            handle (error) {
	       
                if (error.response.data) {

                    if(error.response.status == 500){
                        return alert(error.response.data);
                    }

                    else if (typeof error.response.data == 'string') {
                    
                        this.msg = error.response.data;
                        return alert('There is a problem with your credentials');
                    }

                }

                return alert('We could not handle your request');
                }

            }
    }
</script>