<template>
    <h1>Auto buchen</h1>
    <br />
    <br />
    <br /> <h3>{{user.vorname}} {{user.nachname}}</h3>
    <br /> <h3>{{user.addresse}}</h3>
    <br /> <h3>{{user.telefon}}</h3>
    <br />
    <input type="text" placeholder="Startdatum" v-model="start" required autofocus/>
    <input type="text" placeholder="Enddatum" v-model="ende" required autofocus/>
    <br />
    <br />
    <br />
    <button>
        Anfrage
    </button>
</template>

<script>
import UserService from "../services/user.service";
import Helper from "../services/helper.service";
export default {
    data(){
        return{            
            name: '',
            addresse: '',
            telefon: '',
            start: '',
            ende: '',
            user: null,
        }
    },
    
    methods:{
        beforeMount(){
            UserService.getUser()
            .then((response) =>{
                this.user = response.data.user;                
            })
            .catch((error) => Helper.handle(error));
        }
    }
  
}
</script>

<style scoped>
h1{
    color: blue;
}
p{
    color: black;
}

</style>