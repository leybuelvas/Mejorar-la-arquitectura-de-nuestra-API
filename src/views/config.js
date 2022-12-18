const dotenv = require('dotenv')

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const SECRET = process.env.SECRET;

module.exports = {MONGO_URL, SECRET}