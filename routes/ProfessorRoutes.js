const router = require("express").Router();

const ProfController = require("../controllers/ProfController");
const checarToken = require("../helpers/checar-token")

router.post("/registrarProf", ProfController.registrarProf)
router.post('/loginProf', ProfController.loginProf)
router.get('/checarProf',checarToken, ProfController.checarProf)
router.get('/:idProf', ProfController.buscarProfId)
router.get('/Prof', ProfController.listarProf)
router.delete('/:idProf', ProfController.removerProf)
router.patch('/editar/:idProf', ProfController.editarProf)


module.exports = router
