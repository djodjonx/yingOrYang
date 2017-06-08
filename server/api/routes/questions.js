import express from 'express';
import Question from '../models/question.js';

let router = express.Router();

module.exports = (app) => {


    var question = new Question();

    router.get('/',  question.findAll);

    router.get('/:id',  question.findById);

    router.post('/', question.create);

    router.put('/:id',  question.update);

    router.delete('/:id',  question.delete);

    app.use('/questions', router);

};
