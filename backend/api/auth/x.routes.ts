import express from 'express';
import upload from '../../middleware/multer';
const router = express.Router();
import { signup, login } from './x.controllers';


router.post('/signup', signup);
router.post('/login', login);



export default router;
