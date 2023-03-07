const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId// para verificar o tipo do id

const Admin = require('../models/Admin')
const criarAdminToken = require('../helpers/criar-adm-token')//para quando criar o admin,
                                                            // ele estará autenticado
const extrairToken = require('../helpers/extrair-token')
const extrairAdminToken = require('../helpers/extrair-admin-token')

module.exports = class AdminController{
    //static não é uma função, é só um modificador de escopo.
    static async registrar(req, res){
        const { nome, email, senha, confirmarSenha } = req.body//Destructuring
                                                        //desestruturação
        //console.log(req.body.nome)
        //validação dos campos
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
            // !== valida tipo e conteúdo
            return
        }
        // checar se já existe admin
        const existeAdmin = await Admin.findOne({ email: email })
        if(existeAdmin){res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            //se a variável ExisteAdmin for preenchida, quer dizer que o email já existe
            return
        }
        // hash na senha
        const salt = await bcrypt.genSalt(10)// fortifica a senha
        //se tentar fazer engenharia reversa, para tentar decodificar a senha,
        //vai precisar saber todos os parâmetros 
        const senhaHash = await bcrypt.hash(senha, salt)
        // criando Admin
        const admin = new Admin({
            nome: nome,
            email: email,
            senha: senhaHash
        })
        try{
            const novoAdmin = await admin.save()
            /**
            res.status(201).json({
                mensage: 'usuário criado',
                novoAdmin
            })
             */

            //criando o token do admin.
            //essa função poderá ser usada na hora de login
            //é implementada nos helpers
            await criarAdminToken(novoAdmin, req, res)
            //a função de registrar irá terminar na criação do token
        }catch(error){
            res.status(500).json({ message: error })
            return
            // 500 Internal Server Error
        }
    }//fim da função registrar

    static async login(req, res){
        //preciso realizar algumas validações
        //passar o token
        const { email, senha } = req.body
        if (!email) {res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }      
        if (!senha) {res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }
        //verificar se o usuário existe, precisamos ter o usuário
        const admin = await Admin.findOne({ email: email })
        if (!admin){
            return res.status(422).json({ 
                message: 'E-mail não cadastrado' })
        }
        //checando senha
        const checarSenha = await bcrypt.compare(senha, admin.senha)
        if(!checarSenha){
            return res.status(422).json({ 
                message: 'Senha inválida' })
        }
        await criarAdminToken(admin, req, res)
    }//fim da função login

    static async checarUsuario(req, res){
    //verificando o usuário pelo token
    //verificando quem está logado no sistema
    // verificar se o usuário está autenticado pelo token
    // para validar, podemos usar o Postman e gravar o token
        let atualAdmin// variável não definida
        console.log(req.headers.authorization)
        if (req.headers.authorization) {
            const token = extrairToken(req)//tirar o bearer
            //decodificar o token, verificando se ele é válido
            const decodificarToken = jwt.verify(token, 'nossosecret')
            atualAdmin = await Admin.findById(decodificarToken.id)
            atualAdmin.senha = undefined//zerando a senha no retorno
        }else{
            atualAdmin = null// não existe token
        }
        res.status(200).send(atualAdmin)
    }//fim da função checarUsuario

    static async buscarAdminId(req, res){
        const id = req.params.id
        const admin = await Admin.findById(id).select('-senha')
        if(!admin){
            res.status(422).json({ message: 'Administrador não encontrado!' })
            return
        }
        res.status(200).json({ admin })
    }//fim da função buscarAdminId

    static async listarAdmin(req, res){
        const admin = await Admin.find().sort('-createdAt')
        res.status(200).json({admin: admin})
    }//fim da função listarAdmin

    static async removerAdmin(req, res){
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }
        const admin = await Admin.findOne({ _id: id })
        if (!admin) {
          res.status(404).json({ message: 'Administrador não encontrado!' })
          return
        }
        await Admin.findByIdAndRemove(id)
        res.status(200).json({ message: 'Administrador removido com sucesso!' })
    }//fim da função removerAdmin
    static async editarAdmin(req, res){
        // um usuário pode pegar o id de outro usuário e alterar ele
        // o admin será resgatado pelo token
        const token = extrairToken(req)
        const admin = await extrairAdminToken(token)
        const { nome, email, senha, confirmarSenha } = req.body
        if(!nome){res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        admin.nome = nome
        if (!email) {res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }
        // verificando se já existe o adminstrador
        const adminExistente = await Admin.findOne({ email: email })//objeto chave igual ao valor, pode colocar só email
        if (admin.email !== email && adminExistente) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }
        admin.email = email
        //chegando a senha
        //a senha não é obrigatória. 
        //caso queira mudar a senha, vai cair nos if
        if (senha != confirmarSenha) {
            res.status(422).json({ error: 'As senhas não conferem!.' })
        } else if (senha == confirmarSenha && senha != null) {// o usuário enviou a senha e as senhas são iguais
            const salt = await bcrypt.genSalt(10)
            const reqSenha = req.body.senha  
            const senhaHash = await bcrypt.hash(reqSenha, salt)  
            admin.senha = senhaHash
        }
        try{
            const updateAdmin = await Admin.findOneAndUpdate(
                { _id: admin._id },//filtro, buscando o id
                { $set: admin },//quais dados serão atualizados
                { new: true }//realizar a atualização dos dados                
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updateAdmin,
              })
        }catch(error){
            res.status(500).json({ message: error })
            return
        }
    }//fim da função editarAdmin


}//fim Class AdminController