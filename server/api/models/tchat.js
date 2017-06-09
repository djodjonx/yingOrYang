import mongoose from 'mongoose';

const tchatSchema = new mongoose.Schema({
  users: [],
  messages: []

});


function compare(a, b) {
  return a - b;
}


let model = mongoose.model('Tchat', tchatSchema);

export default class Tchat {


  read(req, res) {
    let users = [];
    users.push(req.params.users);
    console.log(users);
    if(req.params.users !== undefined){
      users = users.sort(compare());
    }
    model.findOne({
      users: users
    }, {
      password: 0
    }, (err, tchat) => {
      if (err || !tchat) {
        res.sendStatus(403);
      } else {
        res.json(tchat);
      }
    });
  }


  write(req, res) {
    let users = req.body.users.sort(compare());
    model.update({
      users: users
    }, req.body, {
      upsert: true,
      new: true
    },(err, tchat) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({
          success: true,
          tchat: tchat
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
