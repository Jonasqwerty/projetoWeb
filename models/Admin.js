const mongoose = require('../db/conexao')
const { Schema } = mongoose

const Admin = mongoose.model(
  'Admin',
  new Schema({
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    senha: {
      type: String,
      required: true,
    }   
  }, {timestamps: true}),//cria duas colunas novas, UpdateAt, CreateAt
)

module.exports = Admin