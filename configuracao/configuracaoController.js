const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const database = require('../database/database');


/**
 * Tela inicial da configuração para fazer o cadastro
 */
router.get('/configuracao', (req, res) => {
    var empresaErro = req.flash('empresaErro');
    var tokenErro = req.flash('tokenErro');
    var telefoneErro = req.flash('telefoneErro');
    

    empresaErro = (empresaErro == undefined || empresaErro.length == 0) ? undefined : empresaErro;
    tokenErro = (tokenErro == undefined || tokenErro.length == 0) ? undefined : tokenErro;
    telefoneErro = (telefoneErro == undefined || telefoneErro.length == 0) ? undefined : telefoneErro;
    
    res.render('configuracao/novo', { empresaErro, tokenErro, telefoneErro });
});

/**
 * Metedo para salvar a configuração no banco de dados
 */
router.post('/configuracao/salvar', (req, res) => {
    var { empresa, telefone, token } = req.body;
    var empresaErro;
    var tokenErro;
    var telefoneErro;
    var sucesso;
    var erro;

    if (empresa == undefined || empresa.length == 0 || empresa == '') {
        empresaErro = 'O campo EMPRESA é obrigatorio';
    }
    if (telefone == undefined || telefone.length == 0 || telefone == '') {
        telefoneErro = 'O campo TELEFONE é obrigatorio';
    }
    if (token == undefined || token.length == 0 || token == '') {
        tokenErro = 'O campo TOKEN é obrigatorio';
    }
    if(empresaErro != undefined || telefoneErro != undefined || tokenErro != undefined){
        req.flash('empresaErro', empresaErro);
        req.flash('tokenErro', tokenErro);
        req.flash('telefoneErro', telefoneErro);
        res.redirect('/configuracao');
    }else{
        var dados = [
            {
                empresa: empresa,
                telefone: telefone,
                token: token
            }
        ]
        var query = database.insert(dados).into('configuracao').then(sucesso => {
            sucesso = 'Dados cadastrado com sucesso';
            req.flash('sucesso', sucesso);
            res.redirect('/configuracao/index');
        }).catch(erro => {
            erro = 'Falha ao inserir dados, chame o suporte tecnico';
            req.flash('erro', erro);
            res.redirect('/configuracao/index');
        });
    }

});

/**
 * Metedo que retorna na view das as empresas cadastradas
 */
router.get('/configuracao/index', (req, res) => {
   database.select('*').table('configuracao').then(dados => { 

    var erro = req.flash('erro');
    var sucesso = req.flash('sucesso');
   

    erro = (erro == undefined || erro.length == 0) ? undefined : erro;
    sucesso = (sucesso == undefined || sucesso.length == 0) ? undefined : sucesso;

    res.render('configuracao/index', { erro: erro, sucesso: sucesso, dados: dados });
   }).catch(erro => {
       erro = 'Falha ao buscar dados ' + erro;
       req.flash('erro', erro);
       res.redirect('configuracao/index');
   }); 
});

/**
 * Metedo para editar, mostrando só a empresa selecionada
 */
router.get('/configuracao/editar/:id', (req, res) => {
    var id = parseInt(req.params.id);
    var empresaErro = req.flash('empresaErro');
    var tokenErro = req.flash('tokenErro');
    var telefoneErro = req.flash('telefoneErro');
    

    empresaErro = (empresaErro == undefined || empresaErro.length == 0) ? undefined : empresaErro;
    tokenErro = (tokenErro == undefined || tokenErro.length == 0) ? undefined : tokenErro;
    telefoneErro = (telefoneErro == undefined || telefoneErro.length == 0) ? undefined : telefoneErro;

    if(id == undefined || id == ''){
        var erro = 'Por favor selecione uma empresa';
        req.flash('erro', erro);
        res.redirect('/configuracao/index');
    }else{
        database.select('*').where({id: id}).table('configuracao').then(dados => { 
            if(!dados[0]){
                var erro = 'Ops: ocorreu algum erro ao listar as configurações';             
                req.flash('erro', erro);
                res.redirect('/configuracao/index');
            }
            res.render('configuracao/editar', {dados, empresaErro, tokenErro, telefoneErro});
        }).catch(err => {
            var erro = 'Ops: ocorreu algum erro ao listar as configurações';
            console.log(err);
            req.flash('erro', erro);
            res.redirect('/configuracao/index');
        });
    }
});
/**
 * Metedo para deletar um configuração
 */
router.post('/configuracao/atualizar', (req, res) => {
    var {empresa, token, telefone, id} = req.body;
    var empresaErro;
    var tokenErro;
    var telefoneErro;
    var sucesso;
    var erro;

    if (empresa == undefined || empresa.length == 0 || empresa == '') {
        empresaErro = 'O campo EMPRESA é obrigatorio';
    }
    if (telefone == undefined || telefone.length == 0 || telefone == '') {
        telefoneErro = 'O campo TELEFONE é obrigatorio';
    }
    if (token == undefined || token.length == 0 || token == '') {
        tokenErro = 'O campo TOKEN é obrigatorio';
    }
    if(empresaErro != undefined || telefoneErro != undefined || tokenErro != undefined){
        req.flash('empresaErro', empresaErro);
        req.flash('tokenErro', tokenErro);
        req.flash('telefoneErro', telefoneErro);
        res.redirect('/configuracao');
    }else{
        database.where({id: id}).update({empresa: empresa, token: token, telefone: telefone}).table('configuracao').then(dados => {
            var sucesso = 'Dados atualizado com sucesso';
            req.flash('sucesso', sucesso);
            res.redirect('/configuracao/index');
        }).catch(erro => {
            req.flash('erro', erro);
            res.redirect('/configuracao/index');
        });
    }
});
/**
 * metedo para deletar
 */
router.post('/configuracao/deletar', (req, res) => {
    var id = req.body.id;
    var erro = 'Erro ao deletar a configuração';
    var sucesso = 'Deletado com suvesso';
    if(id == undefined || id == '' || isNaN(id)){
        req.flash('erro', erro);
        res.redirect('/configuracao/index');
    }else{
        database.where({id: id}).delete().table('configuracao').then(dados => {
            req.flash('sucesso', sucesso);
            res.redirect('/configuracao/index');
        }).catch(err => {
            req.flash('erro', erro);
            res.redirect('/configuracao/index');
        })
    }
});

module.exports = router;
