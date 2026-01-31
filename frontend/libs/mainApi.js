import axios from 'axios'

const mainApi= axios.create({
    baseURL: 'http://172.21.190.231:5000',
    timeout:10000,
    headers:{
        "Content-Type": "application/json"
    }
})



export default mainApi;