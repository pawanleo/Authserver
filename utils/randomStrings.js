const crypto = require('crypto');

exports.generateUID = length => {
    return crypto.randomBytes(length).toString('hex');
};
