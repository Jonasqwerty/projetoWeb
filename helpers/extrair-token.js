//2º helper criado
// extrair token do headers
/**
  o header vem com essa string, por exemplo:
          Bearer eyJhbGciOiJIUzI1NiIsIn
 
 */
//Bearer eyJhbGciOiJIUzI1NiIsIn
const extrairToken = (req) => {
    const tokenHeader = req.headers.authorization
    //retirar a palavra Bearer
    const token = tokenHeader.split(" ")[1]// está setando a segunda parte, o índice 1 do array
                                    //quando tiver um espaço, crio um array  
    return token;
  };
  
  
module.exports = extrairToken;