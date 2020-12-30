<template>
  <div class="carManage">
    <h1>Show all Customers</h1>
    <table >                                    
        <thead>  
          <tr>                            
            <th>Name</th>
            <th>Typ</th>
            <th>Tür</th>
            <th>Sitze</th>
            <th>Preis</th>
            <th>Hersteller</th>
            <th>Kraftstoff</th>
            <th>Verbrauch</th>
            <th>Leistung</th>
            <th>Tankvolumen</th>
            <!-- <th>Edit</th> -->
          </tr>
        </thead>
    </table>
    <br />
      <br />
    <button>Bearbeiten</button>
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


<style scoped>
.carManage{
  background:#443dac;
  color:rgb(205, 213, 214)
}
h1{
    color: rgb(106, 167, 26);
}

h2{
  color:burlywood
}
h3{
  color: aqua;
}
input[type=text], select {
  width: 25%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid rgb(139, 62, 62);
  border-radius: 4px;
  box-sizing: border-box;
}



button{
  margin: 10px 10px;
  box-shadow: 0px 0px 0px 2px #9fb4f2;
	background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
	background-color:#7892c2;
	border-radius:10px;
	border:1px solid #4e6096;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;

  text-align: center;
	font-size:12px;
	padding:12px 39px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center; 
} 
button:hover {
	background-color:#2aa9bf;
  }
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  border-spacing: 5px;
  width: 100%;
}
</style>