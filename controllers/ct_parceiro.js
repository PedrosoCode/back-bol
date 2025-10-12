//TODO - Ajustar todos os controladores

const jwt = require("jsonwebtoken");
const conn = require("../db/conn");
const { TIME, DATE } = require("sequelize");

const getParceiro = async (req, res) => {
  try {
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

    const { sNomeParceiro } = req.body;

    const execQuery = `SELECT * FROM fn_parceiro_negocio_select(:p_codigo, :p_codigo_empresa)`;

    // Executa a consulta
    const results = await conn.query(execQuery, {
      replacements: {
        p_codigo_empresa: jwtInfo.jwt_nCodigoEmpresa,
        p_nome_parceiro: sNomeParceiro, 
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

const getParceiroPorId = async (req, res) => {
  try {

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

    const { nCodigoParceiro } = req.body;

    const execQuery = `CALL sp_select_parceiro_negocio_dados(:p_codigo_empresa, :p_nome_parceiro)`;

    const results = await conn.query(execQuery, {
      replacements: {
        p_codigo_empresa: jwtInfo.jwt_nCodigoEmpresa,
        p_nome_parceiro: nCodigoParceiro, 
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

const updateParceiro = async (req, res) => {

  try {

      const { 
              nCodigoParceiro,
              sRazaoSocial,
              sNomeFantasia,
              sTipoParceiro,
              nTipoParceiro,
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

      const sql = `CALL sp_upsert_parceiro_negocio(:p_codigo,
                                                   :p_codigo_empresa,
                                                   :p_documento,
                                                   :p_telefone,
                                                   :p_email,
                                                   :p_nome_fantasia, 
                                                   :p_razao_social,
                                                   :p_logradouro,
                                                   :p_numero,
                                                   :p_complemento,
                                                   :p_bairro,
                                                   :p_cep,
                                                   :p_contato,
                                                   :p_codigo_pais,
                                                   :p_codigo_cidade,
                                                   :p_codigo_estado,
                                                   :p_codigo_tipo_parceiro)`;

    await conn.query(sql, {
      replacements: {
        p_codigo                : nCodigoParceiro             ,
        p_codigo_empresa        : jwtInfo.jwt_nCodigoEmpresa  ,
        p_documento             : sDocumento                  ,
        p_telefone              : sTelefone                   ,
        p_email                 : sEmail                      ,
        p_nome_fantasia         : sNomeFantasia               ,
        p_razao_social          : sRazaoSocial                ,
        p_logradouro            : sLogradouro                 ,
        p_numero                : sNumero                     ,
        p_complemento           : sComplemento                ,
        p_bairro                : sBairro                     ,
        p_cep                   : sCep                        ,
        p_contato               : sContato                    ,
        p_codigo_pais           : nCodigoPais                 ,
        p_codigo_cidade         : nCodigoCidade               ,
        p_codigo_estado         : nCodigoEstado               ,
        p_codigo_tipo_parceiro  : nTipoParceiro
      }
    });

    res.status(201).json({ message: 'parceiro de negócio criado com sucesso!' });
  } catch (err) {
    console.error('Erro ao inserir parceiro de negócio:', err);
    res.status(500).json({ error: 'Erro ao inserir parceiro de negócio no banco de dados.' });
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
  upsertParceiro,
  DeleteParceiro
}; 