import { ObjectId } from 'mongoose';
import Families from '../../models/Family';
import Users from '../../models/User';
import { Request, Response, NextFunction } from 'express';

export const createFamily = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const family = await Families.create({...req.body, members: [req.user._id, ...req.body.members || []], admins: [req.user._id]})
        
        // update families array for users, using $addToSet to prevent duplicates
        await Promise.all((family?.members || []).map(async (member) => {
            await Users.findByIdAndUpdate(member, {$addToSet: {families: family._id}}, { new: true })
        }));
        await Promise.all((family?.drivers || []).map(async (driver) => {
            await Users.findByIdAndUpdate(driver, {$addToSet: {families: family._id}}, { new: true })
        }));

        // Get populated family data
        const populatedFamily = await Families.findById(family._id)
            .populate({
                path: 'members',
                model: 'User',
                select: 'firstName lastName phoneNumber role'
            })
            .populate({
                path: 'admins',
                model: 'User',
                select: 'firstName lastName phoneNumber role'
            })
            .populate({
                path: 'drivers',
                model: 'User',
                select: 'firstName lastName phoneNumber role'
            })
            .populate({
                path: 'appointments',
                populate: [
                    { 
                        path: 'user',
                        model: 'User',
                        select: 'firstName lastName phoneNumber role'
                    },
                    { 
                        path: 'driver',
                        model: 'User',
                        select: 'firstName lastName phoneNumber role'
                    }
                ]
            });

        return res.json(populatedFamily)
    } catch (error: any) {
        next(error)
    }
}

export const getFamily = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const family = await Families.findById(req.params.familyId).populate('members').populate('admins').populate('drivers')
           
        if (!family) {
            return res.status(404).json({ message: "Family not found" })
        }
        console.log('Family data:', family)
        return res.json(family)
    } catch (error: any) {
        console.error('Error:', error)
        next(error)
    }
}

export const updateFamily = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const family = await Families.findById(req.params.familyId)
        
        // if the user is not an admin of the family
        if(!family?.admins.includes(req.user._id)) {
            return res.status(403).json({message: "You are not an admin of this family"})
        }
        
        // if the user removed all members from the family
        if(!req.body.members.length) {
            return res.status(403).json({message: "You cannot remove all members from the family"})
        }

        // Check members
        await Promise.all(req.body.members?.map(async (member: any) => {
            if(family?.members.includes(member)) {
                await Users.findByIdAndUpdate(member, {$addToSet: {families: family?._id}}, { new: true })
            } else {
                await Users.findByIdAndUpdate(member, {$pull: {families: family?._id}}, { new: true })
            }
        }))
        //drivers
        await Promise.all(req.body.drivers?.map(async (driver: any) => {
            if(family?.drivers.includes(driver)) {
                await Users.findByIdAndUpdate(driver, {$addToSet: {families: family?._id}}, { new: true })
            } else {
                await Users.findByIdAndUpdate(driver, {$pull: {families: family?._id}}, { new: true })
            }
        }))

        // if the only admin is the user himself and he left the family
        if(!req.body.members.includes(req.user._id.toString())) { // req.user._id is a mongoose object damn took hours to figure it out
            if(family?.admins.length === 1){
                const members = req.body.members.filter(member => !family.drivers.includes(member))
                const randomMember = members[Math.floor(Math.random() * members.length)]
                if (randomMember) {
                    await Families.findByIdAndUpdate(family._id, { admins: [randomMember] } , { new: true })
                }
            }
        }

        const newFamily = await Families.findByIdAndUpdate(req.params.familyId, req.body, { new: true })
        return res.json(newFamily)
    } catch (error: any) {
        next(error)
    }
}

export const deleteFamily = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const family = await Families.findById(req.params.familyId)
        if(!family) {
            return res.status(404).json({message: "Family not found"})
        }
        if(!family?.admins.includes(req.user._id)) {
            console.log("admins", family?.admins, req.user._id)
            return res.status(403).json({message: "You are not an admin of this family"})
        }

        // Remove family from all members' families array
        await Promise.all(family.members.map(async (member) => {
            await Users.findByIdAndUpdate(member, {$pull: {families: family._id}}, { new: true })
        }))

        await Families.findByIdAndDelete(family._id)
        return res.json(family)
    } catch (error: any) {
        next(error)
    }
}

export const getAllFamilies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const families = await Families.find().populate({
            path: 'drivers',
            model: 'User'
        })
        console.log(families)
        return res.json(families)
    } catch (error: any) {
        next(error)
    }
}


  