//TODO - Ajustar Delete
//TODO - Ajustar Update

const jwt = require("jsonwebtoken");
const conn = require("../db/conn");
const { TIME, DATE } = require("sequelize");

const getItem = async (req, res) => {
  try {


    const { sDescricao, sCodigoItem } = req.body;
    const nCodigo = null

    const execQuery = `SELECT * FROM fn_cadastro_select_item(:p_codigo, :p_codigo_empresa, :p_codigo_item, :p_descricao)`;

    const [results] = await conn.query(execQuery, { 
      replacements: {
        p_codigo: nCodigo,
        p_codigo_empresa: req.user.codigoEmpresa,
        p_codigo_item: sCodigoItem,
        p_descricao: sDescricao, 
      },
    });

    const retorno = results[0]

    if (!retorno) {
      return res.status(204).json({ error: "Nenhum item encontrado." });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Erro ao buscar item:", err);
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }

    return res.status(500).json({ error: "Erro ao buscar item no banco de dados." });
  }
};

const getItemById = async (req, res) => {
  try {

    const { nCodigoItem } = req.body;

    const execQuery = `SELECT * FROM fn_cadastro_select_item(:p_codigo, :p_codigo_empresa, :p_codigo_item, :p_descricao)`;

    const [results] = await conn.query(execQuery, { 
      replacements: {
        p_codigo: nCodigoItem,
        p_codigo_empresa: req.user.codigoEmpresa,
        p_codigo_item: '',
        p_descricao: ''
      },
    });

    const retorno = results[0]

    if (!retorno) {
      return res.status(204).json({ error: "Nenhum item encontrado." });
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

const insertItem = async (req, res) => {

  try {

      const {
        sCodigoItem,
        sDescricao,
      } = req.body

        
      const sqlInsert = `CALL sp_cadastro_insert_item(:p_codigo_empresa,
                                                         :p_codigo)`;

      const [result] = await conn.query(sqlInsert, {
        replacements: {
          p_codigo                : null,
          p_codigo_empresa        : req.user.codigoEmpresa,
        }
      });


       const nCodigo = result[0].p_codigo

      const sqlUpdate = `CALL sp_cadastro_item_update(:p_codigo,
                                                      :p_codigo_empresa,
                                                      :p_codigo_item,
                                                      :p_descricao)`;

      await conn.query(sqlUpdate, {
        replacements: {
          p_codigo             : nCodigo,
          p_codigo_empresa     : req.user.codigoEmpresa,
          p_codigo_item        : sCodigoItem,
          p_descricao          : sDescricao
        }
      });

    res.status(201).json({ message: 'insercao realizada!', codigo_insert: nCodigo });
  } catch (err) {
    console.error('Erro ao inserir item:', err);
    res.status(500).json({ error: 'Erro ao inserir item.' });
  }
};

const updateItem = async (req, res) => {

  try {

      const {
        nCodigo,
        sCodigoItem,
        sDescricao,
      } = req.body

      const sqlUpdate = `CALL sp_cadastro_item_update(:p_codigo,
                                                      :p_codigo_empresa,
                                                      :p_codigo_item,
                                                      :p_descricao)`;

      await conn.query(sqlUpdate, {
        replacements: {
          p_codigo             : nCodigo,
          p_codigo_empresa     : req.user.codigoEmpresa,
          p_codigo_item        : sCodigoItem,
          p_descricao          : sDescricao
        }
      });

    res.status(201).json({ message: 'atualizacao realizada!' });
  } catch (err) {
    console.error('Erro ao atualizar item:', err);
    res.status(500).json({ error: 'Erro ao atualizar item.' });
  }
};

const deleteItem = async (req, res) => {

  try {

      const { nCodigo } = req.body; 

      const sql = `CALL sp_cadastro_delete_item(:p_codigo_empresa, :p_codigo)`;

    await conn.query(sql, {
      replacements: {
        p_codigo                : nCodigo,
        p_codigo_empresa        : req.user.codigoEmpresa  
      }
    });

    res.status(201).json({ message: 'exclusão realizada!' });
  } catch (err) {
    console.error('Erro ao excluir item:', err);
    res.status(500).json({ error: 'Erro ao item.' });
  }
};

module.exports = {
  getItem,
  getItemById,
  updateItem,
  deleteItem,
  insertItem,
}; 