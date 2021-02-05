var express = require('express');
var router = express.Router();

const Answer = require("../models/answer");
const answer = new Answer();
    
router.post('/create', async (req, res) => {
    try {
        const { _id } = await answer.create(req.body);
        res.status(200).send({ "success": true, "answerId": _id });
    } catch (error) {
        res.status(500).send({ error: true, message: error.message });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const removed = await answer.delete(req.body.answerId);
        res.status(200).send({ "success": true, "removido": removed });
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

router.post('/list', async (req, res) => {
    try {
        const answers = await answer.list(req.body.formId);
        res.status(200).send({ "success": true, "answers": answers });
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const answerData = await answer.get(req.params.id);
        res.status(200).send({ "success": true, "answer": answerData }); 
    } catch (error) {
        res.status(500).send({ error: true, message: error });
    }
});

module.exports = router;