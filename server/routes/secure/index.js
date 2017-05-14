import express from 'express';
const router = express.Router();
import UserModel from '../../models/user.js';
import { Client } from 'authy-client';
import path from 'path';

/* Validator end-point. */
router.get('/status', (req, res) => {
  res.send("<h1>2FA SECURE HOME PAGE</h1><a href='/logout'>LOGOUT</a>")
});
console.log(__dirname);
router.use('/', express.static(path.join(__dirname, '../../../secure_client')));

export default router;

