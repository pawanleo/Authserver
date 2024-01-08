const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/userSchema');
const Client = require('../models/clientSchema');
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET // Use an environment variable for your secret
}, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));
// Basic Strategy for client authentication
passport.use(new BasicStrategy(
    async (clientId, clientSecret, done) => {
        try {
            console.log(clientId,'jj')
            const client = await Client.findOne({ clientId });

            if (!client) {
                return done(null, false); // client not found
            }

            if (!validateClientSecret(clientSecret, client.clientSecret)) {
                return done(null, false); // invalid client secret
            }

            return done(null, client); // client found and validated
        } catch (err) {
            return done(err); // error occurred
        }
    }
));

// Client Password Strategy for client authentication
passport.use(new ClientPasswordStrategy(
    (clientId, clientSecret, done) => {
        Client.findOne({ clientId }, (err, client) => {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }

            if (!validateClientSecret(clientSecret, client.clientSecret)) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));