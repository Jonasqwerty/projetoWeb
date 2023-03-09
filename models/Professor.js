const mongoose = require('../db/conexao')
const { Schema } = mongoose

const Professor = mongoose.model(
  'Professor',
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
  }, {timestamps: true}),
)

module.exports = Professor
