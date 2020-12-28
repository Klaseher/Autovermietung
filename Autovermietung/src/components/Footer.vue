<template>
  <footer class="container">

    <div class="col">
      <div class="logo">
        <a href="/">
          <img alt="logo" src="../assets/logo.png">
        </a>
      </div>
    </div>
    <div class="col">
      <h3 class="text-center">Contacts</h3>
      <hr>
      <p class="text-center">{{ contact }}</p>
    </div>
    <div class="col footer-menu">
      <router-link class="aside-anchor" to="/">Home</router-link>
      <router-link class="aside-anchor" to="/about">HEYRJP</router-link>
      <router-link class="aside-anchor" to="/search">Unsere Autos</router-link>
    </div>
  </footer>
</template>


<script>
//Fusszeile Website
export default {
  data() {
    return {
      contact: 'Hotline: 012345678'
    }
  }
}

</script>

<style lang="scss" scoped>
footer {
  color: #fff;
  display: flex;
  padding: 15px;
  block-size: 150px;
  hr{
    background: #fff;
  }
  a, h3, p {
    color: #fff;
  }
  .logo{
    height: 110px;
    img{
      max-height: 100%;
    }
  }
  .footer-menu{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
  }
}
</style>
