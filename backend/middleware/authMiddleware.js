require('dotenv').config();

const jwt = require('jsonwebtoken');
const { auth } = require('express-oauth2-jwt-bearer');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for validating the JWT with Auth0
const checkJwt = auth({
  audience: process.env.AUTH0_API_IDENTIFIER,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Custom middleware for additional checks (if needed)
const customAuthMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

// Combine both middlewares if you need additional custom checks
const combinedMiddleware = (req, res, next) => {
    checkJwt(req, res, (err) => {
        if (err) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        customAuthMiddleware(req, res, next);
    });
};

// Export the middleware (use combinedMiddleware if needed)
module.exports = combinedMiddleware;
