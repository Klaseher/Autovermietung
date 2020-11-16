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
}

export default new UserService()
