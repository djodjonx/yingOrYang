import express from 'express';
import Tchat from '../models/tchat.js';

let router = express.Router();

module.exports = (app) => {


    var tchat = new Tchat();

    router.put('/read',  tchat.read);


    router.put('/write',  tchat.write);

    app.use('/tchats', router);

};
