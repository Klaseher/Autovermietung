<template>
  <div class="NotFound">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="400" color="transparent" flat>
            <div class="display-3 mt-5">Page not found.</div>
            <div class="grey--text lighten-5">
              The page you are trying to get to never existed in this reality,
              or has migrated to a parallel universe.
            </div>
            <div class="paragraph-text mt-2">
              <br />
              <br />Try going back to home page and repeating your action. Or,
              contact helpdesk for support.
            </div>
            <div>
              <button type="submit" @click="redirect('/')">
                    Go back to Homepage
              </button> 
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
    export default {
          methods : {
            redirect(route){
                 this.$router.push(route)
            }
        }
    }
</script>

<style>
  .paragraph-text {
    font-size: 18px;
  }
</style>