//1º helper a ser criado
//quando criar o usuário, ele já está logado
const jwt = require("jsonwebtoken")

const criarAdminToken = async (admin, req, res)=>{
    // criando o token
    const token = jwt.sign(
        /*
        nesse método, é setado o que vai ser enviado
        além do token
        depois posso estar decodificando o token e pegar esses dados
         */
        {
            nome: admin.nome,
            id: admin._id
        },
        "nossosecret"// secrect, deixa o token único.
    )
    //retornando o token
    res.status(200).json({
        message: "Usuário autenticado",
        token: token,// garante a autenticação
        adminId: admin._id// estará dentro do token
    })
}

module.exports = criarAdminToken

