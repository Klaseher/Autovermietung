export default function authHeader() {
    let jwt = sessionStorage.getItem('jwt');
  
    if (jwt) {
      return { 'x-access-token': jwt };
    } else {
      return {};
    }
  }