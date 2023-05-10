import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
require('dotenv/config');


class App {
    constructor() {
        this.server = express();
        mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_USER}.da0ac8z.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        //
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use(router);
    }
}

export default new App().server;