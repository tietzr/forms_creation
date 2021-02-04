var express = require('express');
var router = express.Router();

const User = require("../models/user");
const user = new User();
    
router.post('/login', async (req, res) => {
    try {
        const { name, _id } = await user.login(req.body);
        res.status(200).send({ "success": true, "user": { name, _id } }); 
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { name, _id } = await user.create(req.body);
        res.status(200).send({ "success": true, "user": { name, _id } });
        
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});


module.exports = router;