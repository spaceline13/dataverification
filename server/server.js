import express from 'express';
import bodyParser from 'body-parser';
var cors = require('cors')
import mongoose from 'mongoose';
import logger from 'morgan';
import mainRoutes from './routes/main';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(
    cors({
        origin: ['https://curate.foodakai.com', 'http://localhost:3010'],
    }),
);

// set up mongoose
mongoose.connect('mongodb://localhost/data-curation')
    .then(()=> {
        console.log('Database connected');
    })
    .catch((error)=> {
        console.log('Error connecting to database');
    });
// set up port
const port = 5035;

// set up home route
app.get('/', (request, respond) => {
    respond.status(200).json({
        message: 'Welcome to Project Support',
    });
});
app.use('/api/', mainRoutes);

app.listen(port, (request, respond) => {
    console.log(`Our server is live on ${port}. Yay!`);
});
