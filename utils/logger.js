const Log = require('../models/logModel');

const logMessage = async (logtype, message, ipAddress, createdBy) => {
    try {
        await Log.create({ logtype, message, ipAddress, createdBy });
    } catch (error) {
        console.error('Error logging message:', error);
    }
};

module.exports = logMessage;
