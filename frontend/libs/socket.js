import {io} from 'socket.io-client'

export const connectWS= (userId,lang)=>{
    return io("http://10.173.251.231:5000",{
        auth:{userId,lang},
        transports:["websocket"]
    })
}
