const oauth2orize = require("oauth2orize");
const server = oauth2orize.createServer();
const AuthorizationCode = require("../models/authorizationCodeSchema");
const Client = require("../models/clientSchema");
const { generateUID } = require("./randomStrings");


// Serialize and deserialize clients
server.serializeClient((client, done) => done(null, client.id));
server.deserializeClient((id, done) => {
  Client.findById(id, (err, client) => {
    if (err) { return done(err); }
    return done(null, client);
  });
});

// Grant authorization codes
server.grant(oauth2orize.grant.code(async (client, redirectUri, user, ares, done) => {
  const code = generateUID(16); // Generate a unique authorization code

  const authorizationCode = new AuthorizationCode({
      code,
      client: client.id, // Store client ID
      redirectUri:client.redirectUri,
      user: user.id, // Store user ID
      expiresIn: 60 * 60 * 24 * 20 
  });

  try {
      await authorizationCode.save();
      done(null, code);
  } catch (err) {
      done(err);
  }
}));
// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(async (client, code, redirectUri, done) => {
    try {
      console.log(client,code,redirectUri)
        const authCode = await AuthorizationCode.findOne({ code })
            .populate('user')
            .populate('client')
            .exec();

        // if (!authCode || client.id.toString() !== authCode.client.id.toString() || redirectUri !== authCode.redirectUri) {
        //     return done(null, false);
        // }

        // Generate Access Token
        const accessToken = await generateAccessToken(authCode.user, authCode.client);

        // Optionally Generate Refresh Token
        const refreshToken = await generateRefreshToken(authCode.user, authCode.client);

        // Assuming you want to delete the auth code after exchange
        await AuthorizationCode.deleteOne({ _id: authCode._id });

        // Return Access Token (and Refresh Token if applicable)
        done(null, accessToken.token, refreshToken ? refreshToken.token : null);
    } catch (err) {
        done(err);
    }
}));

module.exports = server;
