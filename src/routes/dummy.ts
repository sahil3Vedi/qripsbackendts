import express, { Application, Request, Response, NextFunction } from 'express'
const router  = express.Router()
const Dummy = require('../models/Dummy')
const Superuser = require('../models/Superuser')
const auth = require('../middleware/auth')

// Fetches Dummy Products Of a Given Gategory (Unprotected Route)
router.get('/fetchAll/:cat', async(req: Request, res: Response) =>{
    try{
        const dummies = await Dummy.find({ tags: { $all: [req.params.cat] } })
        res.status(200).json({message: dummies})
    } catch(e) {
        res.status(404).json({message: 'Unable to fetch products'})
    }
})

// Fetches Dummy Products
router.get('/fetchDummies', async(req: Request, res: Response) =>{
    try{
        const dummies = await Dummy.find()
        res.status(200).json({message: dummies})
    } catch(e) {
        res.status(404).json({message: 'Unable to fetch products'})
    }
})

// add a Dummy Product to the DB
router.post('/submit', auth, async(req: Request, res: Response) => {
    // Authenticating Superuser
    const superuserFound = await Superuser.findById(req.body.user.id)
    if (!superuserFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    // Creating new Dummy Product
    const {color, company, description, imgs, name, tags, unit_price, unit_weight, is_liquid, unit_capacity} = req.body
    const newDummy =  new Dummy({color, company, description, imgs, name, tags, unit_price, unit_weight, is_liquid, unit_capacity})
    try{
        const savedDummy = await newDummy.save()
        res.status(200).json({ok: true, message: 'Dummy Product Added'})
    } catch {
        res.status(400).json({ok: false, message: 'Unable to Create Product'})
    }
})

// Deletes a dummy product
router.delete('/deleteDummy/:id',auth, async(req: Request, res: Response) => {
    // Authenticating Superuser
    const superuserFound = await Superuser.findById(req.body.user.id)
    if (!superuserFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    // Deleting the Dummy Product
    const product = await Dummy.findById(req.params.id)
    if (!product) res.status(404).json({ok: false, message: 'Dummy Product does not exist'})
    else product.remove().then(()=>res.status(200).json({ok: true, message: 'Dummy Product Deleted'}))
})

// Searches Dummy Products by Tags
router.post('/search',async(req: Request, res: Response) => {
    const searchVal = req.body.val
    try{
        if (searchVal) {
            const dummies = await Dummy.find({tags:{$regex: searchVal, $options: "$i"}},{name:1,company:1})
            res.status(200).json({message: dummies})
        }
        else res.status(200).json({message: []})
    } catch(e) {
        res.status(404).json({message: 'Unable to fetch products'})
    }
})

module.exports = router
