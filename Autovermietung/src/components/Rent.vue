<template>
    <h1>Auto buchen</h1>
    <br />
    <br />
    <br /> <h3>Username</h3>
    <br /> <h3>Adresse</h3>
    <br /> <h3>Telefon</h3>
    <br />
    <input type="text" placeholder="Startdatum" v-model="start" required autofocus/>
    <input type="text" placeholder="Enddatum" v-model="ende" required autofocus/>
    <br />
    <br />
    <br />
    <button>
        Anfrage
    </button>
</template>

<script>
export default {
    data(){
        return{
            name: '',
            addresse: '',
            telefon: '',
            start: '',
            ende: '',
        }
    }
  
}
</script>

<style scoped>
h1{
    color: blue;
}
p{
    color: black;
}

</style>