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

  register (nam, vornam, mail, pass, addr, tel) {
    return axios.post(API_URL + 'register', {
      name: nam,
      vorname: vornam,
      email: mail,
      password: pass,
      address: addr,
      telephone: tel
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
    return axios.put(API_URL + 'employee/' + id, {
      name: nam,
      username: mail,
      password: pass
    })
  }

  deleteEmployee (id) {
    return axios.delete(API_URL + 'employee/' + id)
  }
}

export default new Auth()
