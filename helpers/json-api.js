const transformer = admin =>({
    type: 'adminstrador',
    _id: admin.id,
    attributes:{
        nome: admin.nome,
        email: admin.email
    },
    links: {
        self: `/${admin.id}`
    }
})
//alguma modificação
module.exports = transformer