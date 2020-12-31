require('dotenv').config();

const app = require('./lib/app');

console.log('Starting...');

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${ process.env.PORT }`);
});
