import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import token from '../token.js';

const hashCode = (s) => s.split("").reduce((a, b) => {
  a = ((a << 5) - a) + b.charCodeAt(0);
  a & a;
}, 0);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [
      true, 'Email address is required'
    ],
    validate: [
      function(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      'Please fill a valid email address'
    ],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'
    ],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar:String,
  sexe:String,
  pseudo: String,
  firstName: String,
  lastName: String,
  location: String,
  score: Number,
  statistique: [],
  isAdmin: {
    type: Boolean,
    default: false
  }
});

function filter(users,array,param,callback){
  let score = 100 - param;
  if (score < 10){
    score = 10;
  }else if(score > 90){
    score = 90;
  }

  users.map(function(user){
    if(user.score <= score && user.score >= score -10){
      array.push(user);
    }
      return array;
  });
  callback(array);
};

userSchema.methods.comparePassword = function(pwd, cb) {
  bcrypt.compare(pwd, this.password, function(err, isMatch) {
    if (err)
      cb(err);
    cb(null, isMatch);
  });
};

let model = mongoose.model('User', userSchema);

export default class User {

  connect(req, res) {
    if (!req.body.email) {
      res.status(400).send('Please enter an email');
    } else if (!req.body.password) {
      res.status(400).send('Please enter a password');
    } else {
      model.findOne({
        email: req.body.email
      }, (err, user) => {
        if (err || !user) {
          res.sendStatus(403);
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
              res.status(400).send(err);
            } else {
              if (isMatch) {
                user.password = null;
                let tk = jsonwebtoken.sign(user, token, {expiresIn: "24h"});
                res.json({success: true, user: user, token: tk});
              } else {
                res.status(400).send('Incorrect password');
              }
            }
          });
        }
      });
    }
  }

  findAllByAffinity(req, res) {

    model.find({}, {
      password: 0
    }, (err, users) => {
      if (err || !users) {
        res.sendStatus(403);
      } else {
        filter(users,[],req.params.score,function(data){
          res.json(data);
        })
      }
    });
  }

  findById(req, res) {
    model.findById(req.params.id, {
      password: 0
    }, (err, user) => {
      if (err || !user) {
        res.sendStatus(403);
      } else {
        res.json(user);
      }
    });
  }

  create(req, res) {
    if (req.body.password) {
      var salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    model.create(req.body, (err, user) => {
      if (err ) {
        if (err.code === 11000 || err.code === 11001) {
          err.message = "Email " + req.body.email + " already exist";
        }
        res.status(500).send(err.message);
      } else {
        let tk = jsonwebtoken.sign(user, token, {expiresIn: "24h"});
        res.json({success: true, user: user, token: tk});
      }
    });
  }

  update(req, res) {
    model.update({
      _id: req.params.id
    }, req.body, (err, user) => {
      if (err || !user) {
        res.status(500).send(err.message);
      } else {
        let tk = jsonwebtoken.sign(user, token, {expiresIn: "24h"});
        res.json({success: true, user: user, token: tk});
      }
    });
  }

  updateData(req, res) {
    console.log('ici',req.params, req.body);
    model.update({
      _id: req.params.id
    },req.body,{upsert: true, new: true}, (err, user) => {
      if (err || !user) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        let tk = jsonwebtoken.sign(user, token, {expiresIn: "24h"});
        res.json({success: true, user: user, token: tk});
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
