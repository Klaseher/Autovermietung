//Hilfsfunktionen
import router from '../router'
class Helper {
  //Pfad wechseln
  redirect (route) {
    router.push(route)
  }
  //Error handling vom backend
  handle (error) {
    if (error.response.data) {
      if (typeof error.response.data == 'string') {
        return alert(error.response.data)
      }
    }
    return alert('We could not handle your request')
  }
}

export default new Helper()
