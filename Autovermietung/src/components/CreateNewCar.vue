<template>
    <div class="carCreate">
        <h4>New Car</h4>
        <form>
            <label for="name">Car Name: {{name}}</label>
            <div>
                <input id="name" type="text" v-model="new_name" required autofocus>
            </div>
            <button type="button" @click="updateName">
                    Change  Name
            </button>
        </form>
         
    </div>
</template>

<script>
export default {
  data () {
    return {
      meldung: '',
      name: '',
    }
  }
}
</script>
<style scoped>
.carCreate{


  background:#443dac;
  color:rgb(205, 213, 214)
  
}
h1 {
  
  font-weight:bold;
  color: mediumblue;
  padding:20px;
  text-align: center;
        
  font-size: 30px;
  }

h3{
  color:#00FF00;
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
	padding:10px 60px 10px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content:space-between;
  width: 30%;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  border-spacing: 5px;
  width: 100%;
}

</style>