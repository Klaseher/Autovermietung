//Hier sind alle Fkt., die irgendwelche Daten vom Backend holen
//siehe Endpunkte Backend für spezifische Funktionalitäten

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

  getCar (autoname) {
    return axios.get(API_URL + 'car/' + autoname)
  }
}

export default new UserService()
