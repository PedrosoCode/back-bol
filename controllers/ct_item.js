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
        sRazaoSocial,
        sNomeFantasia,
        sEmail,
        sDocumento,
        sTelefone,
        sContato,
        sLogradouro,
        sBairro,
        sComplemento,
        sNumero,
        sCep,
        nCodigoPais,
        nCodigoCidade,
        nCodigoEstado,
      } = req.body

        
      const sqlInsert = `CALL sp_parceiro_negocio_insert(:p_codigo_empresa,
                                                         :p_codigo)`;

      const [result] = await conn.query(sqlInsert, {
        replacements: {
          p_codigo                : null,
          p_codigo_empresa        : req.user.codigoEmpresa,
        }
      });


       const nCodigo = result[0].p_codigo

      const sqlUpdate = `CALL sp_parceiro_negocio_update(:p_codigo,
                                                         :p_codigo_empresa,
                                                         :p_nome_fantasia,
                                                         :p_razao_social,
                                                         :p_cnpj_cpf,
                                                         :p_codigo_pais,
                                                         :p_codigo_estado,
                                                         :p_codigo_cidade,
                                                         :p_bairro,
                                                         :p_rua,
                                                         :p_n_rua,
                                                         :p_cep,
                                                         :p_email,
                                                         :p_telefone,
                                                         :p_contato,
                                                         :p_complemento)`;

      await conn.query(sqlUpdate, {
        replacements: {
          p_codigo                : nCodigo,
          p_codigo_empresa        : req.user.codigoEmpresa,
          p_nome_fantasia         : sNomeFantasia,
          p_razao_social          : sRazaoSocial,
          p_cnpj_cpf              : sDocumento,
          p_codigo_pais           : nCodigoPais,
          p_codigo_estado         : nCodigoEstado,
          p_codigo_cidade         : nCodigoCidade,
          p_bairro                : sBairro,
          p_rua                   : sLogradouro,
          p_n_rua                 : sNumero,
          p_cep                   : sCep,
          p_email                 : sEmail,
          p_telefone              : sTelefone,
          p_complemento           : sComplemento,
          p_contato               : sContato
        }
      });

    res.status(201).json({ message: 'insercao realizada!', codigo_insert: nCodigo });
  } catch (err) {
    console.error('Erro ao inserir parceiro de negócio:', err);
    res.status(500).json({ error: 'Erro ao inserir parceiro de negócio.' });
  }
};

const updateItem = async (req, res) => {

  try {

      const {
        nCodigoParceiro,
        sRazaoSocial,
        sNomeFantasia,
        sEmail,
        sDocumento,
        sTelefone,
        sContato,
        sLogradouro,
        sBairro,
        sComplemento,
        sNumero,
        sCep,
        nCodigoPais,
        nCodigoCidade,
        nCodigoEstado,
      } = req.body

      const sqlUpdate = `CALL sp_parceiro_negocio_update(:p_codigo,
                                                         :p_codigo_empresa,
                                                         :p_nome_fantasia,
                                                         :p_razao_social,
                                                         :p_cnpj_cpf,
                                                         :p_codigo_pais,
                                                         :p_codigo_estado,
                                                         :p_codigo_cidade,
                                                         :p_bairro,
                                                         :p_rua,
                                                         :p_n_rua,
                                                         :p_cep,
                                                         :p_email,
                                                         :p_telefone,
                                                         :p_contato,
                                                         :p_complemento)`;

      await conn.query(sqlUpdate, {
        replacements: {
          p_codigo                : nCodigoParceiro,
          p_codigo_empresa        : req.user.codigoEmpresa,
          p_nome_fantasia         : sNomeFantasia,
          p_razao_social          : sRazaoSocial,
          p_cnpj_cpf              : sDocumento,
          p_codigo_pais           : nCodigoPais,
          p_codigo_estado         : nCodigoEstado,
          p_codigo_cidade         : nCodigoCidade,
          p_bairro                : sBairro,
          p_rua                   : sLogradouro,
          p_n_rua                 : sNumero,
          p_cep                   : sCep,
          p_email                 : sEmail,
          p_telefone              : sTelefone,
          p_complemento           : sComplemento,
          p_contato               : sContato
        }
      });

    res.status(201).json({ message: 'atualizacao realizada!' });
  } catch (err) {
    console.error('Erro ao atualizar parceiro de negócio:', err);
    res.status(500).json({ error: 'Erro ao atualizar parceiro de negócio.' });
  }
};

const deleteItem = async (req, res) => {

  try {

      const { nCodigoParceiro } = req.body; 

      const sql = `CALL sp_parceiro_negocio_delete(:p_codigo,
                                                   :p_codigo_empresa)`;

    await conn.query(sql, {
      replacements: {
        p_codigo                : nCodigoParceiro             ,
        p_codigo_empresa        : req.user.codigoEmpresa  
      }
    });

    res.status(201).json({ message: 'exclusão realizada!' });
  } catch (err) {
    console.error('Erro ao excluir parceiro de negócio:', err);
    res.status(500).json({ error: 'Erro ao excluir parceiro de negócio.' });
  }
};

module.exports = {
  getItem,
  getItemById,
  updateItem,
  deleteItem,
  insertItem,
}; 