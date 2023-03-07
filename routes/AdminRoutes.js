const router = require("express").Router();

const AdminController = require("../controllers/AdminController");
const checarToken = require("../helpers/checar-token")

router.post("/registrar", AdminController.registrar)
router.post('/login', AdminController.login)
router.get('/checaradmin',checarToken, AdminController.checarUsuario)// se o admin está logado no sistema
router.get('/:id', AdminController.buscarAdminId)
router.get('/', AdminController.listarAdmin)
router.delete('/:id', AdminController.removerAdmin)
router.patch('/editar/:id', AdminController.editarAdmin)


module.exports = router