//3º helper a ser criado.
//verifica o token
//é usado nos routes
const jwt = require("jsonwebtoken");
const extrairToken = require('./extrair-token')//extrai o token do header

const checarToken = (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(401).json({message: "Acesso Negado!"})
  }
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  const token = extrairToken(req)
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    //verificando o token
    const verificar = jwt.verify(token, "nossosecret");
    req.admin = verificar;
    next();
  } catch (err) {
    //o usuário ele pode manipular o token
    return res.status(400).json({ message: "O Token é inválido!" });
  }
};

module.exports = checarToken;