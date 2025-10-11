const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {

      try {
        
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
    }

  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            codigoUsuario: decoded.jwt_nCodigoUsuario,
            nomeUsuario: decoded.jwt_sNomeUsuario,
            codigoEmpresa: decoded.jwt_nCodigoEmpresa
        };
        
        next();
    } catch (error) {
        console.error('Erro na validação do token:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expirado. Faça login novamente.' });
        }
        
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

module.exports = validateJWT;