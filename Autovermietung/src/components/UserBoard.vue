<template>

    <div class="hello">
        <h1>Welcome to regular users page</h1>
        <h2>{{msg}}</h2>
        <div v-on:click="zeigeBestellungen()" class="control">
                <button>
                    Bestellungen
                </button>
        </div>


    </div>
</template>

<script>
//Komponente für Kunde
// import UserService from '../services/user.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      name: '',
      vorname: '',
      adresse: '',
      telefon: '',
    }
  },

  methods: {
    redirect (route) {
      Helper.redirect(route)
    },

     zeigeBestellungen(){
       this.$router.push('/dashboard/bestellungen')

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.user{
  padding:5px;
  background: turquoise;
  background-size:contain;
}
h1{
  font-weight:bold;
  color: mediumblue;
  padding:60px;
  text-align: center;
        
  font-size: 30px;
        
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
	padding:12px 37px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center;
}
</style>
