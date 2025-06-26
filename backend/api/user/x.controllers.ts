import Users from '../../models/User';
import Appointments from '../../models/Appointment';
import Reviews from '../../models/Review';
import Families from '../../models/Family';
import { Request, Response, NextFunction } from 'express';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await Users.find()
        return res.json(users)
    } catch (error: any) {
        next(error)
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findById(req.user._id).select('-password')
       
        return res.json(user)
    } catch (error: any) {
        next(error)
    }
}


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id)
        return res.json({ message: 'User deleted successfully' })
    } catch (error: any) {
        next(error)
    }
}







export const getAllDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const drivers = await Users.find({ role: 'driver' })
        return res.json(drivers)
    } catch (error: any) {
        next(error)
    }
}



// REFRENCE ⬇️

// exports.postsCreate = async (req, res) => {
//     try {
//       if(req.file){
//         console.log(req.file)
//         req.body.file = req.file.path
//       }
//       const newPost = await Post.create(req.body);
//       res.status(201).json(newPost);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.postsDelete = async (req, res) => {
//     const { postId } = req.params;
//     try {
//       const foundPost = await Post.findById(postId);
//       if (foundPost) {
//         await foundPost.deleteOne();
//         res.status(204).end();
//       } else {
//         res.status(404).json({ message: "post not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.postsUpdate = async (req, res) => {
//     const { postId } = req.params;
//     try {
//       const foundPost = await Post.findById(postId);
//       if (foundPost) {
//         await foundPost.updateOne(req.body);
//         res.status(204).end();
//       } else {
//         res.status(404).json({ message: "post not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.postsGet = async (req, res) => {
//     try {
//       const posts = await Post.find();
//       res.json(posts);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  