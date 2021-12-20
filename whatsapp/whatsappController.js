const express = require('express');
const router = express.Router();
const axios = require('axios');
const database = require('../database/database');

router.get('/whatsapp', (req, res) => {
    database.select('*').table('configuracao').then(dados => {

        var erro = req.flash('erro');
        var sucesso = req.flash('sucesso');


        erro = (erro == undefined || erro.length == 0) ? undefined : erro;
        sucesso = (sucesso == undefined || sucesso.length == 0) ? undefined : sucesso;

        res.render('whatsapp/index', { dados: dados, erro: erro, sucesso: sucesso });
    });
});
router.get('/whatsapp/sessionkey/:id_empresa', (req, res) => {
    var id = req.params.id_empresa;
    database.select('*').where({ id: id }).table('configuracao').then(dados => {
        var sessao = dados[0].token;
        var data = '';
        var config = {
            method: 'get',
            url: 'http://192.168.0.191:3333/start?sessionName=' + sessao,
            headers: {},
            data: data
        };
        axios(config)
            .then(sucesso => {
              //  console.log(sucesso);
                if (sucesso.data.result == 'success') {
                    database.where({id: id}).update({ 'sessao': 'ativo' }).table('configuracao').then(sucesso => { });
                    sucesso = 'Sessão criada com sucesso';
                    req.flash('sucesso', sucesso);
                    res.redirect('/whatsapp');
                } else {
                    var erro = 'Falha ao gerar a sessão';
                    req.flash('erro', erro);
                }
            }).catch(erro => {
                console.log(erro);
            })
    }).catch(erro => {
        console.log(erro);
    });
});

router.get('/whatsapp/sessionclose/:id_empresa', (req, res) => {
    var id = req.params.id_empresa;
    database.select('*').where({ id: id }).table('configuracao').then(dados => {
        var sessao = dados[0].token;
        var config = {
            method: 'get',
            url: 'http://192.168.0.191:3333/close?sessionName=' + sessao,
            headers: {}

        };
        axios(config)
            .then(sucesso => {
               // console.log(sucesso);
                if (sucesso.data.result == 'success') {
                    database.where({id: id}).update({ 'sessao': 'inativo' }).table('configuracao').then(sucesso => { });
                    database.where({id: id}).update({ 'qrcode': '' }).table('configuracao').then(sucesso => { });
                    sucesso = 'Sessão encerrado com sucesso';
                    req.flash('sucesso', sucesso);
                    res.redirect('/whatsapp');
                } else {
                    var erro = 'Falha ao gerar ao encerrar a sessão';
                    req.flash('erro', erro);
                }
            }).catch(erro => {
                console.log(erro);
            })
    }).catch(erro => {
        console.log(erro);
    });
});


router.get('/whatsapp/sessionqrcode/:id_empresa', (req, res) => {
    var id = req.params.id_empresa;
    database.select('*').where({ id: id }).table('configuracao').then(dados => {
        var sessao = dados[0].token;
        var data = '';
        var config = {
            method: 'get',
            url: 'http://192.168.0.191:3333/qrcode?sessionName=' + sessao,
            headers: { },
            data: data

        };
        axios(config)
            .then(sucesso => {  
                console.log(sucesso);
                if (sucesso.data.result == 'success') {           
                    database.where({id: id}).update({ 'qrcode': sucesso.data.qrcode }).table('configuracao').then(sucesso => { });                    
                    sucesso = 'QRcode Gerado com sucesso';
                    req.flash('sucesso', sucesso);
                    res.redirect('/whatsapp');
                } else {
                    var erro = 'Falha ao gerar o QRcode';
                    req.flash('erro', erro);
                }
            }).catch(erro => {
                console.log('erro ' + erro);
            })
    }).catch(erro => {
        console.log('erro2 ' + erro);
    });
});
module.exports = router;
