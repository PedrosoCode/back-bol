//TODO - Ajustar Delete
//TODO - Ajustar Update

const jwt = require("jsonwebtoken");
const conn = require("../db/conn");
const { TIME, DATE } = require("sequelize");

const getServico = async (req, res) => {
  try {


    const { sDescricao, sCodigoServico } = req.body;
    const nCodigo = null

    const execQuery = `SELECT * FROM fn_cadastro_select_servico(:p_codigo, :p_codigo_empresa, :p_codigo_servico, :p_descricao)`;

    const [results] = await conn.query(execQuery, { 
      replacements: {
        p_codigo: nCodigo,
        p_codigo_empresa: req.user.codigoEmpresa,
        p_codigo_servico: sCodigoServico,
        p_descricao: sDescricao, 
      },
    });

    const retorno = results[0]

    if (!retorno) {
      return res.status(204).json({ error: "Nenhum servico encontrado." });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Erro ao buscar servico:", err);
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }

    return res.status(500).json({ error: "Erro ao buscar servico no banco de dados." });
  }
};

const getServicoById = async (req, res) => {
  try {

    const { nCodigoServico } = req.body;

    const execQuery = `SELECT * FROM fn_cadastro_select_servico(:p_codigo, :p_codigo_empresa, :p_codigo_servico, :p_descricao)`;

    const [results] = await conn.query(execQuery, { 
      replacements: {
        p_codigo: nCodigoServico,
        p_codigo_empresa: req.user.codigoEmpresa,
        p_codigo_servico: '',
        p_descricao: ''
      },
    });

    const retorno = results[0]

    if (!retorno) {
      return res.status(204).json({ error: "Nenhum servico encontrado." });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Erro ao buscar parceiros:", err);
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }

    return res.status(500).json({ error: "Erro ao buscar parceiros no banco de dados." });
  }
};

const insertServico = async (req, res) => {

  try {

      const {
        sCodigoServico,
        sDescricao,
      } = req.body

        
      const sqlInsert = `CALL sp_cadastro_insert_servico(:p_codigo_empresa,
                                                         :p_codigo)`;

      const [result] = await conn.query(sqlInsert, {
        replacements: {
          p_codigo                : null,
          p_codigo_empresa        : req.user.codigoEmpresa,
        }
      });


       const nCodigo = result[0].p_codigo

      const sqlUpdate = `CALL sp_cadastro_servico_update(:p_codigo,
                                                      :p_codigo_empresa,
                                                      :p_codigo_servico,
                                                      :p_descricao)`;

      await conn.query(sqlUpdate, {
        replacements: {
          p_codigo             : nCodigo,
          p_codigo_empresa     : req.user.codigoEmpresa,
          p_codigo_servico       : sCodigoServico,
          p_descricao          : sDescricao
        }
      });

    res.status(201).json({ message: 'insercao realizada!', codigo_insert: nCodigo });
  } catch (err) {
    console.error('Erro ao inserir servico:', err);
    res.status(500).json({ error: 'Erro ao inserir servico.' });
  }
};

const updateServico = async (req, res) => {

  try {

      const {
        nCodigo,
        sCodigoServico,
        sDescricao,
      } = req.body

      const sqlUpdate = `CALL sp_cadastro_servico_update(:p_codigo,
                                                      :p_codigo_empresa,
                                                      :p_codigo_servico,
                                                      :p_descricao)`;

      await conn.query(sqlUpdate, {
        replacements: {
          p_codigo             : nCodigo,
          p_codigo_empresa     : req.user.codigoEmpresa,
          p_codigo_servico        : sCodigoServico,
          p_descricao          : sDescricao
        }
      });

    res.status(201).json({ message: 'atualizacao realizada!' });
  } catch (err) {
    console.error('Erro ao atualizar servico:', err);
    res.status(500).json({ error: 'Erro ao atualizar servico.' });
  }
};

const deleteServico = async (req, res) => {

  try {

      const { nCodigo } = req.body; 

      const sql = `CALL sp_cadastro_delete_servico(:p_codigo_empresa, :p_codigo)`;

    await conn.query(sql, {
      replacements: {
        p_codigo                : nCodigo,
        p_codigo_empresa        : req.user.codigoEmpresa  
      }
    });

    res.status(201).json({ message: 'exclusão realizada!' });
  } catch (err) {
    console.error('Erro ao excluir servico:', err);
    res.status(500).json({ error: 'Erro ao servico.' });
  }
};

module.exports = {
  getServico,
  getServicoById,
  updateServico,
  deleteServico,
  insertServico,
}; 