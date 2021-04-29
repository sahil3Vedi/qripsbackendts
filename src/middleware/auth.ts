const jwt = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'

function auth(req: Request,res: Response,next: NextFunction) {
    const token = req.header('x-auth-token')
    // Check for token
    if(!token) res.status(401).json({message:'No Token, Authorization Denied'})

    try{
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Add user from payload
        req.body.user = decoded;
        next();
    } catch(e) {
        res.status(400).json({message:'Token is not valid'})
    }
}

module.exports = auth
