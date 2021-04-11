import app from './src/server.js';
import {PORT} from './src/utils/config.js';

app.listen(PORT, () => {
    console.log(`Starting app on port ${PORT}`)
});

