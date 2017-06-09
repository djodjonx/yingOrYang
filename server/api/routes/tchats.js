import express from 'express';
import Tchat from '../models/tchat.js';

let router = express.Router();

module.exports = (app) => {


    var tchat = new Tchat();

    router.get('/:users',  tchat.read);


    router.put('/',  tchat.write);

    app.use('/tchats', router);

};
