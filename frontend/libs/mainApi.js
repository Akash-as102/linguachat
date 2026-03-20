import axios from 'axios'

const mainApi= axios.create({
    baseURL: "http://10.173.251.231:3000",
    timeout:10000,
    headers:{
        "Content-Type": "application/json"
    }
})



export default mainApi;