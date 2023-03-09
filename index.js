const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())

app.use(cors({ credentials: true, origin: 'http://localhost:8080' }))

const AdminRoutes = require('./routes/AdminRoutes')
app.use('/', AdminRoutes)

const AlunoRoutes = require('./routes/AlunoRoutes')
app.use('/aluno', AlunoRoutes)

const ProfessorRoutes = require('./routes/ProfessorRoutes')
app.use('/professor', ProfessorRoutes)

app.listen(5000,()=>{
    console.log(`API rodando na porta 5000`)
})
