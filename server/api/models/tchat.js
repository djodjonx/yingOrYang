import mongoose from 'mongoose';

const tchatSchema = new mongoose.Schema({
  send: String,
  read: String,
  message: String,
  date:{type: Date, default: Date.now}


});



let model = mongoose.model('Tchat', tchatSchema);

export default class Tchat {


  read(req, res) {

    model.find({
      $or: [{
        send: req.body.user1,read:req.body.user2
      }, {
        send: req.body.user2,read:req.body.user1
      }]
    }, (err, tchats) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json(tchats);
      }
    });
  }


  write(req, res) {
        model.create(req.body, (err, tchat) => {
          if (err) {
            res.sendStatus(500);
          } else {
            model.find({
              $or: [{
                send: req.body.send,read:req.body.read
              }, {
                send: req.body.read,read:req.body.send
              }]
            }, (err, tchats) => {
              if (err) {
                res.sendStatus(404);
              } else {
                res.json(tchats);
              }
            });
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
