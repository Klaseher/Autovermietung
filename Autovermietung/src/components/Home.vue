<template>
  <div id="app-home">
    <div class="home">
      <div class="container">
        <h1>{{ msg }}</h1>
        <hr>
      </div>
      <router-view/>
      <div class="container">
        <h2 class="text-center">Unsere Partner</h2>
        <hr>

      </div>
      <div>
        <vueper-slides
            :visible-slides="4"
            class="no-shadow container partner-slider"
            ref="vueperslides2"
            @slide="$refs.vueperslides1.goToSlide($event.currentSlide.index, { emit: false })"
            :bullets="false"
            :touchable="false"
            :gap="2.5"
            :arrows="false"
            :autoplay="true"
            :duration="3000">
          <vueper-slide
              v-for="(slide, i) in slides"
              :key="i"
              :image="slide.image">
          </vueper-slide>
        </vueper-slides>
      </div>
    </div>
  </div>


</template>

<script>
//Homepage-Komponente
import {VueperSlides, VueperSlide} from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
  name: 'out',
  components: {
    VueperSlides,
    VueperSlide,
  },
  data() {
    return {
      msg: ' Welcome to HEYRJP',
      block: 'full',
      slides: [
        {image: require('@/assets/Marke/audi.png')},
        {image: require('@/assets/Marke/bmw.png')},
        {image: require('@/assets/Marke/VW.png')},
        {image: require('@/assets/Marke/Merc.png')},
        {image: require('@/assets/Marke/opel.png')},
        {image: require('@/assets/Marke/mazda.png')},
        {image: require('@/assets/Marke/porsche.png')},
      ]
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="scss" scoped>
.partner-slider .vueperslide {
  box-sizing: border-box;
  transition: 0.3s ease-in-out;
  opacity: 0.7;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
}

.partner-slider .vueperslide--active {
  opacity: 1;
}
</style>
