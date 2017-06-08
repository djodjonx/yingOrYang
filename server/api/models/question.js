import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: [
    {
      type: String
    },
    [
      {
        type: String
      }
    ]
  ],
  categorie: {
    type: String
  }

});

let model = mongoose.model('Question', questionSchema);

export default class Question {

  findAll(req, res) {
    model.find({}, {
      password: 0
    }, (err, questions) => {
      if (err || !questions) {
        res.sendStatus(403);
      } else {
        res.json(questions);
      }
    });
  }

  findById(req, res) {
    model.findById(req.params.id, {
      password: 0
    }, (err, question) => {
      if (err || !question) {
        res.sendStatus(403);
      } else {
        res.json(question);
      }
    });
  }

  create(req, res) {
    console.log(req.body);
    model.create(req.body, (err, question) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({success: true, question: question});
      }
    });
  }

  update(req, res) {
    model.update({
      _id: req.params.id
    }, req.body, (err, question) => {
      if (err || !question) {
        res.status(500).send(err.message);
      } else {
        res.json({success: true, question: question});
      }
    });
  }

  delete(req, res) {
    model.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.sendStatus(200);
      }
    });
  }
}
