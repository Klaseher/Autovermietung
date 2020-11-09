<template>
<div id="app">
  <div class="home" v-bind:style="{ background: actColor}">
    <h1>{{msg}}</h1>
    <img alt="logo" src="../assets/logo2.png">
     
        <router-view/>
      
    
      <h2>Unsere Partner</h2>
      <div>
        <img alt="partner" src="../assets/audii.png">     
        <img alt="partner" src="../assets/bmw.png">
        <img alt="partner" src="../assets/VW.png">
        <img alt="partner" src="../assets/Merc.png">
        <img alt="partner" src="../assets/opel.png">
        <img alt="partner" src="../assets/mazda.png">
        <img alt="partner" src="../assets/porsche.png">
     </div>
  </div>
  

</div>
  
</template>

<script>

export default {
  name: 'out',
  components: {
    
    
  },
  data(){
    return{
     msg: ' Welcome to HEYRJP',
     actColor: 'lightgreen'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app{
  background-color:lightgreen;
}
h1{
  font-size: 4rem;
  color: blue;
}
h2{
  font-size: 3rem;
  color:crimson;
}
image{
  size: 19px;
  height: 15px;
  padding: 10rem;
}
h3 {
  margin: 40px 0 0;
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
