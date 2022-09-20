const {PrismaClient} = require('@prisma/client')
const db = new PrismaClient();
db.$connect();
module.exports = db