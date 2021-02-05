const AnswersDb = require("../db/answer");

class Answer {
    constructor() {
        this.Answers = AnswersDb
    }

    get(answerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const answerData = await this.Answers.findById(answerId);
                resolve(answerData);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    create(answersData) {
        return new Promise(async (resolve, reject) => {
            try {
                answersData.dtCreate = (new Date()).toLocaleString();
                const result = await this.Answers.create(answersData);
                resolve(result);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    list(formId) {
        return new Promise((resolve, reject) => {
            try {
                this.Answers.find({ formId }).lean().then(answers => {
                    resolve(answers);
                });
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    delete(answerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.Answers.findByIdAndDelete(answerId);
                resolve(true);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    deleteByForm(formId) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.Answers.deleteMany({ formId });
                resolve(true);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }

    deleteByUser(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.Answers.deleteMany({ userId });
                resolve(true);
            } catch (error) {
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });
    }
}

module.exports = Answer;