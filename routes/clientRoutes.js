const express=require('express');
const { registerClient } = require('../services/clientServices');


const router=express.Router();

router.post('/register-client',registerClient)

module.exports=router