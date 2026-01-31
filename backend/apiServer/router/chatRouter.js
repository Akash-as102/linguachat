const {Router}=require('express');
const chatRouter=Router();
const chatController= require('../controller/chatController')

// chatRouter.get('/chat',chatController.chatMetaData);

module.exports=chatRouter