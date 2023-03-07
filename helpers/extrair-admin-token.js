//4º helper a ser criado
//usado para o update
//extrair o admin do token
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");


const extrairAdminToken = async (token) => {
  //console.log('função extrairAdminToken')
  if (!token) return res.status(401).json({ error: "Acesso negado!" });// se o token não existe
  const decodificar = jwt.verify(token, "nossosecret");
  const adminId = decodificar.id;
  const admin = await Admin.findOne({ _id: adminId });
  return admin;
};

module.exports = extrairAdminToken;