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

  // bestellung durch kunden erstellt
  createOrder (auto, start, ende, kosten) {
    return axios.post(API_URL + 'rent/', {
      auto: auto,
      start: start,
      ende: ende,
      kosten: kosten
    })
  }

  //bestellung abbrechen kunde
  updateStatusOrder (bnr, status) {
    return axios.put(API_URL + 'order/' + bnr + '/updateStatus', {
      status: status
    })
  }

  //bestellung kosten hinzufuegen
  addCost (bnr, typ, kosten, beschreibung) {
    return axios.post(API_URL + 'order/' + bnr + '/cost', {
      typ: typ,
      kosten: kosten,
      beschreibung: beschreibung
    })
  }

   //auto schaden hinzufuegen
   addSchaden (autoname, beschreibung, prio, typ, kosten) {
    return axios.post(API_URL + 'car/' + autoname + '/schaeden', {
      beschreibung: beschreibung,
      prio: prio,
      typ: typ,
      kosten: kosten
    })
  }

   //schaden auto prioritaet updaten
   updatePriority (auto, pos, status) {
    return axios.put(API_URL + 'car/' + auto + '/schaeden/updateStatus', {
      pos: pos,
      status: status
    })
  }
}

export default new Auth()
