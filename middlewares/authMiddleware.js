import jwt, { decode } from 'jsonwebtoken'
import Admin from '../models/AdminUser.js'

const checkAuth = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        let token
        try {
            token = req.headers.authorization.split(' ')[1]
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.admin = await Admin.findById(decoded.id).select(
                "-password -enabled"
            )
            
            return next()

        } catch (error) {
            const err = new Error('Token inválido')
            return res.status(403).json({msg: err.message})
        }    
    
    } 
    if(token === '' || !token){
        const error = new Error('Token inválido')
        return res.status(403).json({msg: error.message})
    }

    next()
}

export default checkAuth