const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

const Prof = require('../models/Prof')
const criarAdminToken = require('../helpers/criar-adm-token')
const extrairToken = require('../helpers/extrair-token')
const extrairAdminToken = require('../helpers/extrair-admin-token')

module.exports = class ProfController{
    
    static async registrar(req, res){
        const { nome, email, senha, confirmarSenha } = req.body
        
        if(!nome){res.status(422).json({ message: "O nome é obrigatório!!!" })
            //422 - Unprocessable Entity
            return// cancela o restante do processo do código
        }
        if(!email){res.status(422).json({ message: "O e-mail é obrigatório!" })
            return
        }
        if(!senha){res.status(422).json({ message: "A senha é obrigatória!" })
            return
        }
        if(!confirmarSenha){res.status(422).json({ message: "A confirmação de senha é obrigatória!" })
            return
        }
        if(senha !== confirmarSenha){res.status(422).json({message: "Senhas não conferem!"})
            return
        }
        const existeProf = await Prof.findOne({ email: email })
        if(existeProf){res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }
        
        const salt = await bcrypt.genSalt(10)
        const senhaHash = await bcrypt.hash(senha, salt)
        const prof = new Prof({
            nome: nome,
            email: email,
            senha: senhaHash
        })
        try{
            const novoProf = await prof.save()
            /**
            res.status(201).json({
                mensage: 'usuário criado',
                novoAdmin
            })
             */

            await criarAdminToken(novoProf, req, res)
        }catch(error){
            res.status(500).json({ message: error })
            return
        }
    }

    static async login(req, res){
        const { email, senha } = req.body
        if (!email) {res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }      
        if (!senha) {res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }
        const prof = await Prof.findOne({ email: email })
        if (!prof){
            return res.status(422).json({ 
                message: 'E-mail não cadastrado' })
        }
        const checarSenha = await bcrypt.compare(senha, prof.senha)
        if(!checarSenha){
            return res.status(422).json({ 
                message: 'Senha inválida' })
        }
        await criarAdminToken(prof, req, res)
    }

    static async checarUsuario(req, res){
        let atualProf
        console.log(req.headers.authorization)
        if (req.headers.authorization) {
            const token = extrairToken(req)
            const decodificarToken = jwt.verify(token, 'nossosecret')
            atualProf = await Prof.findById(decodificarToken.id)
            atualProf.senha = undefined
        }else{
            atualProf = null
        }
        res.status(200).send(atualProf)
    }

    static async buscarProfId(req, res){
        const id = req.params.id
        const prof = await Prof.findById(id).select('-senha')
        if(!prof){
            res.status(422).json({ message: 'Professor não encontrado!' })
            return
        }
        res.status(200).json({ prof })
    }

    static async listarProf(req, res){
        const prof = await Prof.find().sort('-createdAt')
        res.status(200).json({prof: prof})
    }

    static async removerProf(req, res){
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }
        const prof = await Prof.findOne({ _id: id })
        if (!prof) {
          res.status(404).json({ message: 'Professor não encontrado!' })
          return
        }
        await Prof.findByIdAndRemove(id)
        res.status(200).json({ message: 'Professor removido com sucesso!' })
    }
    static async editarProf(req, res){
        const token = extrairToken(req)
        const prof = await extrairAdminToken(token)
        const { nome, email, senha, confirmarSenha } = req.body
        if(!nome){res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        prof.nome = nome
        if (!email) {res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }
        const profExistente = await Prof.findOne({ email: email })
        if (prof.email !== email && profExistente) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }
        prof.email = email

        if (senha != confirmarSenha) {
            res.status(422).json({ error: 'As senhas não conferem!.' })
        } else if (senha == confirmarSenha && senha != null) {
            const salt = await bcrypt.genSalt(10)
            const reqSenha = req.body.senha  
            const senhaHash = await bcrypt.hash(reqSenha, salt)  
            prof.senha = senhaHash
        }
        try{
            const updateProf = await Prof.findOneAndUpdate(
                { _id: prof._id },
                { $set: prof },
                { new: true }               
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updateProf,
              })
        }catch(error){
            res.status(500).json({ message: error })
            return
        }
    }
}
