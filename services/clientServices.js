const Client = require("../models/clientSchema");
const { validateClientData } = require("../utils/validateClientData");
const { v4: uuidv4 } = require('uuid'); // uuid for generating unique IDs
const registerClient= async (req, res) => {

    try {
        // Extract client information from the request body
        const { name, redirectUri } = req.body;

        // Validate the input
        const validationErrors = validateClientData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Generate clientId and clientSecret
        const clientId = uuidv4();
        const clientSecret = uuidv4();

        // Create and save the new client
        const newClient = new Client({ name, clientId, clientSecret, redirectUri });
        await newClient.save();

        // Send the clientId and clientSecret back to the client
        // NOTE: clientSecret should be displayed only once and stored securely by the client.
        res.json({ clientId, clientSecret });
    } catch (error) {
        console.error(error); // Log the error for server-side debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports={registerClient}