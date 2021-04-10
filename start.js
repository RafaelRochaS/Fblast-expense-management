import app from './src/server.js';
import {PORT} from './src/utils/config.js';

console.log('Starting app on port ' + PORT);

app.listen(PORT);

