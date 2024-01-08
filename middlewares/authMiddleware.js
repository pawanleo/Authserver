const Client = require("../models/clientSchema");
const jwt = require('jsonwebtoken');
    
// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    const client_id=encodeURIComponent(req.query.client_id)
    
    const token = req.cookies.jwt

    if (!token) {
        return res.redirect(`/oauth/login?client_id=${client_id}`);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded user information to the request
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.redirect(`/oauth/login?client_id=${client_id}`);
    }
}
// Middleware to validate the authorization request
async function validateAuthorizationRequest(req, res, next) {
   
    const clientId = req.query.client_id;


    try {
        const client = await Client.findOne({ clientId: clientId });

        if (!client) {
            return res.status(400).send('Invalid client ID');
        }
    

        next();
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error('Database error:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports={isAuthenticated,validateAuthorizationRequest}