<template>
  <div class="cusManage">
    <h1>Show all Customers</h1>
    <table >                                    
        <thead>  
          <tr>                            
            <th>Name</th>
            <th>Vorname</th>
            <th>Benutzername</th>
            <th>Adresse</th>
            <th>Telefon</th>
            <!-- <th>Edit</th> -->
          </tr>
        </thead>
    </table>
    <br />
      <br />
      
      <button @click="back()">Zurück</button> 

  </div>
</template>

<script>
export default {
 data () {
    return {}
  
},
methods:{
    
    
    back () {
      this.$router.push('/admin')
    }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.cusManage{
 background:#443dac;
  color:rgb(205, 213, 214)
}
h1{
    color: rgb(221, 219, 120);
}


h2 {
  margin: 40px 0 0;
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
	padding:20px 40px 20px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center;
  width: 20%;
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  border-spacing: 5px;
  width: 100%;
}
</style>