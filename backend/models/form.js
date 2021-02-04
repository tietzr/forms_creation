const mongoose = require('mongoose');

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
    }
    get(formId) {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = await this.Forms.findById(formId);

                if (formData) {
                    formData.asnwers = await this.Forms.findById(formId);
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
                    resolve(await this.Forms.updateOne(formData));
                }
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    delete(formId) {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = await this.Forms.findByIdAndDelete(formId);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }
}

module.exports = Form;