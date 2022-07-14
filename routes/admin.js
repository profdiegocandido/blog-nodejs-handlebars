const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//Arquivos Models
const { categorias } = require("../models/Categoria")
const { postagens } = require("../models/Postagem")


// Rotas Categorias
router.get('/categorias', (req,res) =>{
    categorias.find().lean().then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    })
})

router.get('/categorias/add', (req,res) =>{
    res.render('admin/addcategoria')
})

router.post('/categoria/nova', (req,res) =>{
    
    let erros = []

    if(!req.body.nome || req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"}) 
    }
    if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"}) 
    }
    if(erros.length > 0){
        res.render("admin/addcategoria", {erros: erros})
    }else{
        const novaCategoria = new categorias({
            nome: req.body.nome,
            slug: req.body.slug

            })
        novaCategoria.save();
        res.redirect('/admin/categorias')
    }
})

router.get('/categorias/edit/:id', (req,res) =>{
    categorias.findOne({_id:req.params.id}).lean().then((categorias) =>{
        res.render('admin/editcategoria', {categorias: categorias})
    })     
})

router.post('/categorias/edit', (req,res) =>{
    let filter = { _id: req.body.id }
    let update = { nome: req.body.nome, slug: req.body.slug }
    categorias.findOneAndUpdate(filter, update).then(() => {
        req.flash("success_msg", "Categoria atualizada")
        res.redirect('/admin/categorias')
    }).catch(err => {
      req.flash("error_msg", "Erro ao atualizar categoria")
    })
})

router.post('/categoria/apagar', (req,res) => {
    categorias.deleteOne({
        _id: req.body.id
    }).then(() =>{
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect('/admin/categorias')
    })
})

// Rotas Postagens
router.get('/postagens', (req,res) =>{
    postagens.find().populate("categoria").sort({date:"desc"}).lean().then((postagens) =>{
        res.render('admin/postagens', { postagens: postagens })
    })
})
router.get('/postagem/add', (req,res) =>{
    categorias.find().lean().then((categorias) =>{
        res.render('admin/addpostagem', {categorias: categorias})
    })
})
router.post('/postagem/nova', (req,res) =>{
    const novaPostagem = new postagens({
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        categoria: req.body.categoria
    })
   novaPostagem.save();
   req.flash("success_msg", "Postagem realizada com sucesso")
   res.redirect('/admin/postagens')
})

router.get('/postagem/edit/:id', (req,res) =>{
    postagens.findOne({_id:req.params.id}).lean().then((postagens) =>{
        res.render('admin/editpostagem', {postagens: postagens})
    })
})

router.post('/postagem/edit', (req,res) =>{
    let filter = { _id: req.body.id }
    let update = { titulo: req.body.titulo, descricao: req.body.descricao }
    postagens.findOneAndUpdate(filter, update).then(() => {
        req.flash("success_msg", "Postagem atualizada")
        res.redirect('/admin/postagens')
    }).catch(err => {
      req.flash("error_msg", "Erro ao atualizar categoria")
    })
})

router.get('/postagem/apagar/:id', (req,res) => {
    postagens.remove({
        _id: req.params.id
    }).then(() =>{
        req.flash("success_msg", "Postagem apagada com sucesso")
        res.redirect('/admin/postagens')
    })
})

module.exports = router;