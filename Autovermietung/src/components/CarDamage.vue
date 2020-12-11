<template>
    <div>
        <h1> {{msg}} </h1>
        <button type="cancel" @click="back">Zurueck zum Start</button>
    </div>
</template>


<script>
export default {
    data(){
        return{
            msg: '',
            schaeden: []
        }
    },
    methods: {
        back() {
            this.$router.push("/admin")
        },

    },
    beforeMount(){
        this.msg = "Uebersicht Schaeden Auto: " + this.$route.params.autoname
        //hier schaeden holen fuer auto
    }
}
 
</script>

<style >
p{
    color:white;
    text-align: center;
    font-size: small;
}
</style>
