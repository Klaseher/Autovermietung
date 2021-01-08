//Hier sind alle Fkt., die irgendwelche Daten vom Backend holen
//siehe Endpunkte Backend für spezifische Funktionalitäten

import axios from 'axios'

const API_URL = process.env.API_SERVER_URL || 'http://localhost:3000/'
console.error(process.env);
class UserService {
    saveCar(car) {
        return axios.post(API_URL + 'save-car/', car);
    }
    removeCar(car) {
        return axios.post(API_URL + 'delete-car/', car);
    }

    getCar(autoname) {
        return axios.get(API_URL + 'car/' + autoname);
    }
    getTypes(){
        return axios.get(API_URL + 'car-types');
    }
    getDoorNumbers(){
        return axios.get(API_URL + 'car-door-numbers');
    }
}

export default new UserService()
