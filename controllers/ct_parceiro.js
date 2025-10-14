//TODO - Ajustar Delete
//TODO - Ajustar Update

const jwt = require("jsonwebtoken");
const conn = require("../db/conn");
const { TIME, DATE } = require("sequelize");

const getParceiro = async (req, res) => {
  try {


    const { sNomeParceiro } = req.body;
    const nCodigo = null

    const execQuery = `SELECT * FROM fn_parceiro_negocio_select(:p_codigo, :p_codigo_empresa, :p_nome)`;

    const [results] = await conn.query(execQuery, { 
      replacements: {
        p_codigo: nCodigo,
        p_codigo_empresa: req.user.codigoEmpresa,
        p_nome: sNomeParceiro, 
      },
    });

    const retorno = results[0]

    if (!retorno) {
      return res.status(404).json({ error: "Nenhum parceiro encontrado." });
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

const getParceiroPorId = async (req, res) => {
  try {

    const { nCodigoParceiro } = req.body;

    const execQuery = `SELECT * FROM fn_parceiro_negocio_select(:p_codigo, :p_codigo_empresa, :p_nome)`;

    const [results] = await conn.query(execQuery, {
      replacements: {
        p_codigo: nCodigoParceiro,
        p_codigo_empresa: req.user.codigoEmpresa,
        p_nome: '', 
      },
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Nenhum parceiro encontrado." });
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

const insertParceiro = async (req, res) => {

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

    res.status(201).json({ message: 'insercao realizada!' });
  } catch (err) {
    console.error('Erro ao inserir parceiro de negócio:', err);
    res.status(500).json({ error: 'Erro ao inserir parceiro de negócio.' });
  }
};

const updateParceiro = async (req, res) => {

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

const DeleteParceiro = async (req, res) => {

  try {

      const { 
              nCodigoParceiro
            } = req.body; 

        const authHeader = req.headers["authorization"];
        if (!authHeader) {
          return res.status(401).json({ error: "Token não fornecido." });
        }
    
        const token = authHeader.split(" ")[1];
        if (!token) {
          return res.status(401).json({ error: "Token inválido." });
        }
    
        const jwtInfo = jwt.verify(token, process.env.JWT_SECRET);
        if (!jwtInfo || !jwtInfo.jwt_nCodigoEmpresa) {
          return res.status(403).json({ error: "Token inválido ou expirado." });
        }

      const sql = `CALL sp_delete_parceiro_negocio(:p_codigo,
                                                   :p_codigo_empresa)`;

    await conn.query(sql, {
      replacements: {
        p_codigo                : nCodigoParceiro             ,
        p_codigo_empresa        : jwtInfo.jwt_nCodigoEmpresa  
      }
    });

    res.status(201).json({ message: 'exclusão realizada!' });
  } catch (err) {
    console.error('Erro ao excluir parceiro de negócio:', err);
    res.status(500).json({ error: 'Erro ao excluir parceiro de negócio.' });
  }
};

module.exports = {
  getParceiro,
  getParceiroPorId,
  updateParceiro,
  DeleteParceiro,
  insertParceiro,
}; 