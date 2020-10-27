import authHeader from './auth-header';
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

class UserService {
  getCarbyName(param) {
    return axios.get(API_URL + 'car/' + param);
  }

  getAuthentication() {
    return axios.get(API_URL + 'authenticate', { headers: authHeader() }); //remove headers, optional for jwt local save
  }

  testToken() {
    return axios.get(API_URL + 'testToken', { headers: authHeader() });  //remove headers, optional for jwt local save
  }

}

export default new UserService();