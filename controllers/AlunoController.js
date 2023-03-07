const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

const Aluno = require('../models/Aluno')
const criarAlunoToken = require('../helpers/criar-adm-token')
const extrairToken = require('../helpers/extrair-token')
const extrairAlunoToken = require('../helpers/extrair-admin-token')

module.exports = class AlunoController{
    
    static async registrarAluno(req, res){
        const { nome, email, senha, confirmarSenha } = req.body
                                                        
        if(!nome){res.status(422).json({ message: "O nome é obrigatório!!!" })
            
            return
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
        if(senha !== confirmarSenha){res.status(422).json({message: "As senhas precisam ser iguais!"})
            
            return
        }
        
        const existeAluno = await Aluno.findOne({ email: email })
        if(existeAluno){res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            
            return
        }
        
        const salt = await bcrypt.genSalt(10)
         
        const senhaHash = await bcrypt.hash(senha, salt)
        
        const aluno = new Aluno({
            nome: nome,
            email: email,
            senha: senhaHash
        })
        try{
            const novoAluno = await aluno.save()
            /**
            res.status(201).json({
                mensage: 'usuário criado',
                novoAdmin
            })
             */
            await criarAlunoToken(novoAluno, req, res)
            
        }catch(error){
            res.status(500).json({ message: error })
            return
            
        }
    }

    static async loginAluno(req, res){
        
        const { email, senha } = req.body
        if (!email) {res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }      
        if (!senha) {res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }
        
        const aluno = await Aluno.findOne({ email: email })
        if (!aluno){
            return res.status(422).json({ 
                message: 'E-mail não cadastrado' })
        }
        
        const checarSenha = await bcrypt.compare(senha, aluno.senha)
        if(!checarSenha){
            return res.status(422).json({ 
                message: 'Senha inválida' })
        }
        await criarAlunoToken(aluno, req, res)
    }

    static async checarAluno(req, res){
    
        let atualAluno
        console.log(req.headers.authorization)
        if (req.headers.authorization) {
            const token = extrairToken(req)
            
            const decodificarToken = jwt.verify(token, 'nossosecret')
            atualAluno = await Aluno.findById(decodificarToken.id)
            atualAluno.senha = undefined
        }else{
            atualAluno = null
        }
        res.status(200).send(atualAluno)
    }

    static async buscarAlunoId(req, res){
        const id = req.params.id
        const aluno = await Aluno.findById(id).select('-senha')
        if(!aluno){
            res.status(422).json({ message: 'Aluno não encontrado!' })
            return
        }
        res.status(200).json({ admin })
    }

    static async listarAluno(req, res){
        const aluno = await Aluno.find().sort('-createdAt')
        res.status(200).json({aluno: aluno})
    }

    static async removerAluno(req, res){
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }
        const aluno = await Aluno.findOne({ _id: id })
        if (!aluno) {
          res.status(404).json({ message: 'Aluno não encontrado!' })
          return
        }
        await Aluno.findByIdAndRemove(id)
        res.status(200).json({ message: 'Aluno removido com sucesso!' })
    }
    static async editarAluno(req, res){
        
        const token = extrairToken(req)
        const aluno = await extrairAlunoToken(token)
        const { nome, email, senha, confirmarSenha } = req.body
        if(!nome){res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        aluno.nome = nome
        if (!email) {res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }
        
        const alunoExistente = await Aluno.findOne({ email: email })
        if (aluno.email !== email && alunoExistente) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }
        aluno.email = email
        
        if (senha != confirmarSenha) {
            res.status(422).json({ error: 'As senhas não conferem!.' })
        } else if (senha == confirmarSenha && senha != null) {
            const salt = await bcrypt.genSalt(10)
            const reqSenha = req.body.senha  
            const senhaHash = await bcrypt.hash(reqSenha, salt)  
            aluno.senha = senhaHash
        }
        try{
            const updateAluno = await Aluno.findOneAndUpdate(
                { _id: aluno._id },
                { $set: aluno },
                { new: true }              
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updateAluno,
              })
        }catch(error){
            res.status(500).json({ message: error })
            return
        }
    }


}