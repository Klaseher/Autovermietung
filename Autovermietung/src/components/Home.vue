<template>
  <div id="app-home">
    <div class="home" v-bind:style="{ background: actColor}">
      <h1>{{msg}}</h1>
      <img alt="logo" src="../assets/logo.png">
      <router-view/>  
      <h2>Unsere Partner</h2>
      <div>
          <img alt="partner" src="../assets/Marke/audi.png">     
          <img alt="partner1" src="../assets/Marke/bmw.png">
          <img alt="partner2" src="../assets/Marke/VW.png">
          <img alt="partner3" src="../assets/Marke/Merc.png">
          <img alt="partner4" src="../assets/Marke/opel.png">
          <img alt="partner5" src="../assets/Marke/mazda.png">
          <img alt="partner6" src="../assets/Marke/porsche.png">
      </div>
    </div>
    <app-footer></app-footer>
  </div>

  
  
</template>

<script>
//Homepage-Komponente
import Footer from './Footer.vue'
export default {
  name: 'out',
  components: {
    'app-footer': Footer
    
  },
  data(){
    return{
     msg: ' Welcome to HEYRJP',
     actColor: 'rgb(68, 20, 199)',
     block: 'full'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app-home{
  padding: 5px;
  background-color:rgb(68, 20, 199);
  /* -webkit-text-size-adjust:auto; */
  background-size: cover;
}
h1{
  font-size: 4rem;
  color: white;
}
h2{
  font-size: 3rem;
  color:darkslategrey;
}
img{
  height: 15pc;
  width: 15pc;
  padding: 10 10rem;
  background-size: auto;
}
h3 {
  margin: 40px 0 0;
}


</style>
