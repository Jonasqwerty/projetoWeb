const router = require("express").Router();

const ProfessorController = require("../controllers/ProfessorController");
const checarToken = require("../helpers/checar-token")

router.post("/registrarProf", ProfessorController.registrarProf)
router.post('/loginProf', ProfessorController.loginProf)
router.get('/checarProf',checarToken, ProfessorController.checarProf)
router.get('/:idProf', ProfessorController.buscarProfId)
router.get('/Prof', ProfessorController.listarProf)
router.delete('/:idProf', ProfessorController.removerProf)
router.patch('/editar/:idProf', ProfessorController.editarProf)


module.exports = router
