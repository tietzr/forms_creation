var mongoose = require("mongoose")

const schema = new mongoose.Schema({ 
    dtCreate: 'string',
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Forms'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    latitude: "string",
    longitude: "string",
    answers: [{
        questionId: "string",
        answer: "string"
    }]
});

module.exports = mongoose.model('Answers', schema);