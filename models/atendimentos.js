const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data).format('YYYY-MM-DD');

        const validarData = moment(data).isSameOrAfter(dataCriacao);
        const validarCliente = atendimento.cliente.length >= 3;

        const validacoes = [
            { nome: 'data', valido: validarData, mensagem: 'Data inválida' },
            { nome: 'cliente', valido: validarCliente, mensagem: 'Nome inválido' }
        ];

        console.log('1', data, '2', dataCriacao);

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if (existemErros) {
            res.status(400).json(erros);
        } else {

            const atendimentoDatado = { ...atendimento, dataCriacao, data };

            const sql = 'INSERT INTO Atendimentos SET ?';

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(201).json(atendimento);
                }
            })
        }
    }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }
        });
    }
    
    buscaPorId(id, res) {
        const sql = 'SELECT * FROM Atendimentos WHERE id = ?';

        conexao.query(sql, id, (erro, resultados) => {
            const atendimento = resultados[0];
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(atendimento);
            }
        });
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data).format('YYYY-MM-DD');
        }

        const sql = 'UPDATE Atendimentos SET ? WHERE id = ?';

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({...valores, id});
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id = ?';

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({id});
            }
        });
    }
}

module.exports = new Atendimento;