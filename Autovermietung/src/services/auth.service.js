import axios from 'axios'
import router from '../router'

const API_URL = 'http://localhost:3000/'

class Auth {
  logout () {
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('auth')
    router.push('/')
  }

  login (mail, pass) {
    return axios.post(API_URL + 'login', {
      email: mail,
      password: pass
    })
  }

  register (nam, mail, pass) {
    return axios.post(API_URL + 'register', {
      name: nam,
      email: mail,
      password: pass
    })
  }

  registerEmployee (nam, mail, pass) {
    return axios.post(API_URL + 'register-employee', {
      name: nam,
      username: mail,
      password: pass
    })
  }

  // eslint-disable-next-line camelcase
  updateEmployee (id, nam, mail, pass, new_pass) {
    return axios.post(API_URL + 'update-employee', {
      id: id,
      name: nam,
      username: mail,
      password: pass,
      new_password: new_pass
    })
  }
}

export default new Auth()
