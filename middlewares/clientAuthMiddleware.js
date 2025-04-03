import jwt, { decode } from 'jsonwebtoken'
import Client from '../models/ClientUser.js'

const checkClientAuth = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        let token
        try {
            token = req.headers.authorization.split(' ')[1]
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.client = await Client.findById(decoded.id).select(
                "-password"
            )
            
            return next()

        } catch (error) {
            const err = new Error('Token inválido')
            return res.status(403).json({msg: err.message})
        }    
    
    } 

    if(token === '' || !token){
        const error = new Error('Token inválido')
        res.status(403).json({msg: error.message})
    }

    next()
}

export default checkClientAuth