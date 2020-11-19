//Hier sind alle Fkt., die irgendwelche Daten vom Backend modifizieren 
//bzw. die etwas mit Authentifizierung zu tun haben oder auch benötigen
//siehe Endpunkte Backend für spezifische Funktionalitäten
import axios from 'axios'
import router from '../router'

const API_URL = 'http://localhost:3000/'

class Auth {
  //hier wird Person abgemeldet, wobei Authentifizierungs-Paramter aus Browser 
  //entfernt werden --> Wenn Cookie vorhanden, ist Anmelden aber direkt wieder möglich
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

  registerEmployee (nam, vornam, mail, pass) {
    return axios.post(API_URL + 'register-employee', {
      name: nam,
      vorname: vornam,
      username: mail,
      password: pass
    })
  }

  // eslint-disable-next-line camelcase
  updateEmployee (id, nam, mail, pass) {
    return axios.put(API_URL + 'employee/' + id, {
      name: nam,
      username: mail,
      password: pass
    })
  }

  deleteEmployee (id) {
    return axios.delete(API_URL + 'employee/' + id)
  }

  resetUserPW (mail) {
    return axios.post(API_URL + 'reset-userpw', {
      email: mail
    })
  }

  resetUserPWConfirmation (id, token, password) {
    return axios.post(API_URL + 'confirm-pwreset', {
      id: id,
      token: token,
      password: password
    })
  }


}

export default new Auth()
