import {io} from 'socket.io-client'

export const connectWS= (userId)=>{
    return io('http://172.21.190.231:5000',{
        auth:{userId},
        transports:["websocket"]
    })
}
