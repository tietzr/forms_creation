const mongoose = require('mongoose');
const Answer = require("./answer");

class Form {
    constructor() {
        const schema = new mongoose.Schema({
            name: 'string',
            dtCreate: "string",
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            questions: [{
                questionOrder: "number",
                question: "string",
                placeholder: "string",
                maxLength: "number",
                required: "boolean"
            }],
            dtUpdate: "string"
        });
        this.Forms = mongoose.model('Forms', schema);
        this.answerList = new Answer();
    }
    get(formId) {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = await this.Forms.findById(formId).lean();

                if (formData) {
                    formData.answers = await this.answerList.list(formId);
                    resolve(formData);
                } else {
                    reject('Formulário não encontrado!');
                }
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    list(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const forms = await this.Forms.find( { userId });
                resolve(forms);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    save(formData) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!formData._id) {
                    formData.dtCreate = (new Date()).toLocaleString();
                    resolve(await this.Forms.create(formData));
                } else {
                    formData.dtUpdate = (new Date()).toLocaleString();
                    const result = await this.Forms.updateOne({ _id: formData._id}, formData)
                    resolve(formData._id);
                }
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    delete(formId) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.Forms.findByIdAndDelete(formId);
                await this.answerList.deleteByForm(formId);
                resolve(true)
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }
}

module.exports = Form;