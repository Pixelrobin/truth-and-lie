const app = require('./lib/app');
const PORT = 3001;

console.log('Starting');

app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`);
});
