import express from 'express';
const router = express.Router();
import UserModel from '../../models/user.js';

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/continue', (req, res) => {
  if(req.session.startingPoint){
    const tmp = req.session.startingPoint;
    req.session.startingPoint = null;
    res.redirect(tmp);
  }
  else{
    res.redirect('/secure/home');
  }
});


import userRoute from './user.js';
router.use('/user/', userRoute);
import authyRoute from './authy.js';
router.use('/2fa/', authyRoute);


export default router;
