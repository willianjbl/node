import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Models
import Post from './models/Post.js';

dotenv.config({path: 'variables.env'});

// Database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error => {
    console.error(`ERRO: ${error.message}`);
}));

import app from './app.js';

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor rodando na porta: ${server.address().port}`);
});
