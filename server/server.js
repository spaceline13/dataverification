import express from 'express';
import bodyParser from 'body-parser';
var cors = require('cors');
import mongoose from 'mongoose';
import logger from 'morgan';
import mainRoutes from './routes/main';
import {eraseProducts, fetchProductsFromPlatformToMongo} from "./controllers/product";
import {eraseHazards, fetchHazardsFromPlatformToMongo} from "./controllers/hazard";
var CronJob = require('cron').CronJob;

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
// set up home route
app.get('/', (request, respond) => {
    respond.status(200).json({
        message: 'Welcome to Project Support',
    });
});
app.use('/api/', mainRoutes);


var harvest = new CronJob('0 0 2 * * 1', function() {
    console.log('---- Harvest Started: ', new Date(), '----');
    eraseProducts();
    fetchProductsFromPlatformToMongo(0);
    eraseHazards();
    fetchHazardsFromPlatformToMongo(0);
}, null, true, 'Europe/Athens');
harvest.start();

// set up port
const port = 5035;

app.listen(port, (request, respond) => {
    console.log(`Our server is live on ${port}. Yay!`);
});
