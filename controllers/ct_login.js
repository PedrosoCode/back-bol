const conn = require('../db/conn');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const getEmpresas = async (req, res) => {
  try {

    const [results, metadata] = await conn.query('SELECT * FROM fn_auth_select_empresa()');

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'falha no combo empresas.' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Erro no combo empresas:', err);
    res.status(500).json({ error: 'Erro no combo empresas.' });
  }
};

const login = async (req, res) => {
  try {
    const { sNomeUsuario, sSenha, nCodigoEmpresa } = req.body;

    if (!nCodigoEmpresa || !sNomeUsuario || !sSenha) {
      return res.status(400).json({ error: 'Dados insuficientes para logar' });
    }

    const sql = `
      SELECT * FROM fn_auth_valida_senha(:p_nome_usuario, :p_codigo_empresa)
    `;

    const [rows] = await conn.query(sql, { 
      replacements: {
        p_nome_usuario: sNomeUsuario,
        p_codigo_empresa: nCodigoEmpresa
      }
    });

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Usuário ou senha incorreta!' });
    }

    const match = await bcrypt.compare(sSenha, user.senha);
    if (!match) {
      return res.status(401).json({ message: 'Usuário ou senha incorreta!' });
    }

    const payload = {
      jwt_sNomeUsuario: sNomeUsuario,
      jwt_nCodigoEmpresa: nCodigoEmpresa,
      jwt_nCodigoUsuario: user.codigo
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({ token });

  } catch (err) {
    console.error('Erro ao logar usuário:', err);
    res.status(500).json({ error: 'Erro ao logar usuário no banco de dados.' });
  }
};

module.exports = {
  getEmpresas,
  login
};