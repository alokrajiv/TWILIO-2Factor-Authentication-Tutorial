import express from 'express';
const router = express.Router();
import UserModel from '../../models/user.js';
import { Client } from 'authy-client';

/* Validator end-point. */
router.post('/user_exists', (req, res) => {
  UserModel.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
          res.json({ "valid": true });
        }
        else{
          res.json({ "valid": false });
        }
  });
});

router.post('/login', (req, res) => {
  UserModel.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
          res.redirect('/login?messg=username%20doesn%27t%20exist');
        }
        else{
            user.comparePassword(req.body.user_password, function(err, obj){
                if(err){
                    console.log(err);
                    res.json({messg: "error"});
                }
                else if (obj === false){
                    res.redirect('/login?messg=password%20doesn%27t%20match');
                }
                else if (obj === true){
                    req.session.loggedIn = true;
                    req.session.user = user.toObject();
                    delete req.session.user.password; //remove password hash from session
                    res.redirect('/continue');
                }

            });
        }
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/register', (req, res) => {
    console.log(req.body);

    const authy = new Client({ key: process.env.DEMO_AUTHY_API_KEY });
    authy.registerUser({
            countryCode: req.body.country_code,
            email: req.body.email,
            phone: req.body.phone_number
    }, function (err, regRes) {
            if (regRes.success === true){
                const newUser = new UserModel({
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                email: req.body.email,
                password: req.body.user_password,
                userRole: 'regular',
                authyId: regRes.user.id
            });
            newUser.save(err => {
                if (err) {
                    const retData = { onSave: 'failed' };
                    if (process.env.NODE_ENV == 'TEST') {
                        retData.error = err
                    }
                    res.json(retData);
                    console.log(err);
                }
                else {
                    res.redirect('/login?messg=log%20in%20for%20your%20first%20time!');
                };

            });
        }
        
    });
    
});

export default router;

