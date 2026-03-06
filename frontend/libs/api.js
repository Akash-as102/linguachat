import axios from 'axios'

const api= axios.create({
    baseURL: "http://10.173.251.231:3000",
    timeout:10000,
    headers:{
        "Content-Type": "application/json"
    }
})

export function setApiTokenHeader(token){
    api.defaults.headers.common['Authorization']=`Bearer ${token}`
}

export default api;