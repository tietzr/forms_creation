const mongoose = require('mongoose');

class User {
    constructor() {
        const schema = new mongoose.Schema({ 
            idForm: 'string',
            questionOrder: 'string',
            name: 'string',
            password: "string",
            confirmPassword: 'string',
            dtCreate: 'string'
        });
        this.Users = mongoose.model('Users', schema);
    }
    login(userData) {  
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.Users.findOne(userData);
                if (user){
                    resolve(user);
                } else {
                    reject('Usuário ou senha incorretos, tente novamente!');
                }
            } catch (error){
                reject('Erro ao processar requisição!. Detalhes: ' + error.message);
            }
        });      
    }

    create(userData) {
        return new Promise(async (resolve, reject) => {
            if (await this.Users.exists({ $or: [ { username: userData.username}, { email: userData.email  } ] } )){
                reject('Usuário ou Email já cadastrado na base de dados!');
            } else {
                try {
                    resolve(await this.Users.create(userData));
                } catch (error){
                    reject('Erro ao processar requisição!. Detalhes: ' + error.message);
                }
            }
        });
    }
}

module.exports = User;