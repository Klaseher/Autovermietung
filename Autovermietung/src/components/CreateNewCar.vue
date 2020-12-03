<template>
    <div class="newCar">
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