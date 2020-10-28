import axios from 'axios'

const API_URL = 'http://localhost:3000/'

class UserService {
  getAuthentication () {
    return axios.get(API_URL + 'authenticate')
  }

  testToken () {
    return axios.get(API_URL + 'testToken')
  }

  getEmployee (username) {
    return axios.get(API_URL + 'employee/' + username)
  }
  // example request for implementing car search
  searchCar (name, type, price) {
    return axios.get(API_URL + 'car/' + name + '/' + type + '/' + price)
  }
}

export default new UserService()
