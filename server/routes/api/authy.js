import express from 'express';
const router = express.Router();
import UserModel from '../../models/user.js';

import { Client } from 'authy-client';
const authy = new Client({ key: process.env.DEMO_AUTHY_API_KEY });


router.get('/send_softtoken/', (req, res) => {
  authy.requestSms({ authyId: req.session.user.authyId }, function(err, resp) {
    if (err){ 
        console.log(err); 
        console.log("Not registered user");
        res.redirect('/2fa?messg=Twilio%20is%20facing%20problems%20contacting%20you.');
     }
     else{
      console.log('Message sent successfully to', resp.cellphone);
      res.redirect('/2fa/softtoken/');
     }
  });
});

router.post('/verify_softtoken/', (req, res) => {
  if(!req.session.user.authyId) {
    res.redirect('/2fa');
  }
  else{
      authy.verifyToken({ authyId: req.session.user.authyId, token: req.body.softtoken }, function(err, tokenRes) {
          if (err) console.log(err);
          else {req.session.authy = tokenRes.success;}
          res.redirect('/continue');
        });
  }
  
});

router.get('/send_onetouch/', (req, res) => {

    authy.createApprovalRequest({
      authyId: req.session.user.authyId,
      details: {
        hidden: {
          ip_address: '10.10.3.203'
        },
        visible: {
          location: 'Dubai, UAE',
          username: req.session.user.firstName+" "+req.session.user.lastName
        }
      },
      logos: [{
        res: 'default',
        url: 'https://example.com/logos/default.png'
      }, {
        res: 'low',
        url: 'https://example.com/logos/low.png'
      }],
      message: 'Login requested for Alok\'s Twilio 2FA Test App.',
    }, {
      ttl: 120
    }, function(err, resp) {
      if (err){ 
        console.log(err); 
        console.log("Not registered user");
        res.redirect('/2fa?messg=TRY%20SOFT%20TOKEN;%20Twilio%20reported%20that%20it%20couldn%27t%20connect%20to%20your%20authy%20registered%20device%20if%20any.');
     }
      else{
        console.log('Approval request UUID', resp.approval_request.uuid);
        req.session.onetouch = resp.approval_request
        res.redirect('/2fa/onetouch/');
      }
    });
  
  
});

router.get('/verify_onetouch/', (req, res) => {
  authy.getApprovalRequest({ id: req.session.onetouch.uuid }, function(err, resp) {
    if (err) console.log(err);
    console.log('Approval request', resp.approval_request);
    if(resp.approval_request.status === "approved"){
      req.session.authy = true;
    }
    res.json(resp.approval_request)
  });
});

export default router;
