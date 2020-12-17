<template>
<footer>
    <p>{{contact}}</p>
</footer>
</template>


<script>

export default {
    data(){
        return{
            contact:'Hotline: 012345678'
        }
    }
}
 
</script>

<style scoped>
footer{
    background: black;
    padding: 15px;
    block-size: 20px;
}
p{
    color:white;
    text-align: center;
    font-size: small;
}
</style>
