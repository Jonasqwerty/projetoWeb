const router = require("express").Router();

const AlunoController = require("../controllers/AlunoController");
const checarToken = require("../helpers/checar-token")

router.post("/registrarAluno", AlunoController.registrarAluno)
router.post('/loginAluno', AlunoController.loginAluno)
router.get('/checarAluno',checarToken, AlunoController.checarAluno)
router.get('/:idAluno', AlunoController.buscarAlunoId)
router.get('/Aluno', AlunoController.listarAluno)
router.delete('/:idAluno', AlunoController.removerAluno)
router.patch('/editar/:idAluno', AlunoController.editarAluno)


module.exports = router