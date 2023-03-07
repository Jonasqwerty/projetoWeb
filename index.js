const express = require('express')
const app = express()
const cors = require('cors')
/**
cors - Compartilhamento de Recursos de Origem Cruzada
    
    - corrige os problemas de requisições sendo enviadas
        para o mesmo domínio. Quando estamos rodando a API
        e o front-end, o navegador poderá bloquear. 
        O Cors realiza esse desvio a proteção que existe 
        no próprio navegador
 */
app.use(express.json())
//app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))// porta 3000 front end
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }))// porta 3000 front end - Vuejs
//app.use(express.static('public'))
//rotas
const AdminRoutes = require('./routes/AdminRoutes')
app.use('/', AdminRoutes)

const AlunosRoutes = require('./routes/AlunoRoutes')
app.use('/aluno', AlunosRoutes)
//servidor
app.listen(5000,()=>{
    console.log(`API rodando na porta 5000`)
})