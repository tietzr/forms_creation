var express = require('express');
var router = express.Router();

const Form = require("../models/form");
const form = new Form();
    
router.post('/save', async (req, res) => {
    try {
        const { _id } = await form.save(req.body);
        res.status(200).send({ "success": true, "formId": _id });
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

router.post('/list', async (req, res) => {
    try {
        const forms = await form.list(req.body._id);
        res.status(200).send({ "success": true, "forms": forms });
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const formData = await form.get(req.params.id);
        res.status(200).send({ "success": true, "form": formData }); 
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

module.exports = router;