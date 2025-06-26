import express from 'express';
import upload from '../middleware/multer';
import userRouter from './user/x.routes';
import familyRouter from './family/x.routes';
import appointmentRouter from './appointment/x.routes';
import reviewRouter from './review/x.routes';
import authRouter from './auth/x.routes';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/family', familyRouter);
router.use('/appointments', appointmentRouter);
router.use('/review', reviewRouter);


export default router;