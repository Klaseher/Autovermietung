<template>
    <div class="hello">
         <button type="submit" @click="logout">
                    Logout
        </button>
        <h1>Welcome to regular users page</h1>
        <h2>{{msg}}</h2>
        
    </div>
</template>

<script>
    import UserService from '../services/user.service';
    export default {
        data () {
            return {
                msg: 'The commoners'
            }
        },

         methods : {
           logout(){
               sessionStorage.removeItem('role');
               sessionStorage.removeItem('auth');
               this.$router.push("/")
           }
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