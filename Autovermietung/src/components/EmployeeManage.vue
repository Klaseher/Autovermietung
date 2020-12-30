<template>
  <div class="EmpManage">
    <h1>Mitarbeiterübersicht</h1>
    <div >
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
          <tbody>
           <tr v-for="(employee, index) in employees" :key="index">
              <td>{{employee.nachname}}</td>
              <td>{{employee.user}}</td>
              <td><button class="button btn" @click="editingEmployee(employee.id)">Edit</button></td>
            </tr>
          </tbody>
      </table>
      <br />
      <br />
      <button class="button btn" @click="createEmployee()">Neuen Mitarbeiter anlegen</button>
      <button class="button btn" @click="back()">Zurück</button>     
    </div> 
     
                <br/>
                <br/>
  </div>
</template>

<script>
import UserService from '../services/user.service'
import Helper from '../services/helper.service'
export default {
  data () {
    return {
      vorname: '',
      name: '',
      username: '',
      password: '',
      password_confirmation: '',
     
      created: '',
      content: '',
      admin: false, //speichern, ob Mitarbeiter Admin ist
      seen: true,
      editEmployee: false,
      
      employees: [], //Alle Mitarbeiter
      
    }
  },
  methods:{
    ladeEmployees () {
        UserService.getEmployee()
          .then(response => {
            this.employees.push.apply(this.employees, response.data.employees)
          })
          .catch((error) => Helper.handle(error))
      
      
    },
    
    //Pfad auf detaillierte Mitarbeiteranzeige erneuern
    createEmployee(){
      this.$router.push('/admin/newEmployee')
    },

    back () {
      this.$router.push('/admin')
    },
    //Pfad auf detaillierte Mitarbeiteranzeige ändern
    editingEmployee (id) {
      this.$router.push('/admin/editEmployee/' + id)
    },
    
    redirect (route) {
      Helper.redirect(route)
    }
  },
  
  
  
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

.EmpManage{


 background:#443dac;
  color:rgb(205, 213, 214)
  
}
h1 {
  
  font-weight:bold;
  color: rgb(221, 216, 149);
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
.button{
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
	font-size:14px;
	padding:20px 40px 20px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
  align-content: center;
  width: 20%;
}
.btn:hover {
  background-color: #96b428;
  color: rgb(26, 12, 12);
}
label{
  color:indigo;
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
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  border-spacing: 5px;
  width: 100%;
}
</style>