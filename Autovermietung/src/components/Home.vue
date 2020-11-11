<template>
  <div id="app">
    <div class="home" v-bind:style="{ background: actColor}">
      <h1>{{msg}}</h1>
      <img alt="logo" src="../assets/logo2.png">
      <router-view/>  
      <h2>Unsere Partner</h2>
      <div>
          <img alt="partner" src="../assets/Marke/audii.png">     
          <img alt="partner1" src="../assets/Marke/bmw.png">
          <img alt="partner2" src="../assets/Marke/VW.png">
          <img alt="partner3" src="../assets/Marke/Merc.png">
          <img alt="partner4" src="../assets/Marke/opel.png">
          <img alt="partner5" src="../assets/Marke/mazda.png">
          <img alt="partner6" src="../assets/Marke/porsche.png">
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
     actColor: 'rgb(199, 62, 20)',
     block: 'full'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app{
  background-color:rgb(199, 62, 20);
  -webkit-text-size-adjust:auto;
}
h1{
  font-size: 4rem;
  color: white;
}
h2{
  font-size: 3rem;
  color: black;
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
  color: #13a865;
}
</style>
