import axios from 'axios'

const API_URL = 'http://localhost:3000/'

class UserService {
  getAuthentication () {
    return axios.get(API_URL + 'authenticate')
  }

  testToken () {
    return axios.get(API_URL + 'testToken')
  }

  getEmployee (id) {
    return axios.get(API_URL + 'employee/' + id)
  }

  // example request for implementing car search
  getCar (autoname) {
    return axios.get(API_URL + 'car/' + autoname)
  }

  getUser () {
    return axios.get(API_URL + 'rent/')
  }

  // bestellungen holen
  getOrder (bnr) {
    return axios.get(API_URL + 'order/' + bnr)
  }

   // testen, ob bestellung mit bnr u. auto existiert
   testOrder (bnr, auto) {
    return axios.get(API_URL + 'order/' + bnr + "/" + auto)
  }

   // bestellungen holen
   getOrderCost (bnr) {
    return axios.get(API_URL + 'order/' + bnr + '/cost')
  }

   // schaeden von auto holen
   getSchaeden (autoname) {
    return axios.get(API_URL + 'car/' + autoname + '/schaeden')
  }
  
}

export default new UserService()
