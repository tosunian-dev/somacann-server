import Client from "../models/ClientUser.js"
import bcrypt from 'bcrypt-nodejs'
import JWTGen from "../helpers/JWTGen.js"

const register = async (req, res) => {
    const {name, email, password} = req.body
    // Prevenir usuarios duplicados
    const usuarioExiste = await Client.findOne({email})

    if(usuarioExiste){
        const error = new Error('Este usuario ya existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        bcrypt.hash(password, null, null, async (error, crypt) => {
            if(error){
            } else{
                const client = new Client(req.body)
                client.password = crypt
                const clientSaved = await client.save()
                res.json({msg: 'Tu cuenta ha sido creada, iniciá sesión'})
            }
        })
        
    } catch (error) {
        console.log(error)
    }  
}

const login = async (req, res) => {
    const { email, password  } = req.body
    // Check client existence 
    const client = await Client.findOne({email})

    if(!client){
        const error = new Error("Usuario o contraseña incorrecto")
        return res.status(404).json({ msg: error.message})
    } 
    
    // Check if client is enabled
    if(!client.enabled){
        const error = new Error("Tu cuenta no está habilitada")
        return res.status(404).json({ msg: error.message})
    }

    // Check password
    bcrypt.compare(password, client.password, async (error, check) => {
        if(check){
            res.json({
                token: JWTGen(client._id),
                name: client.name,
                _id: client._id,
                email: client.email
            })
        } else{
            const error = new Error("Contraseña incorrecta")
            return res.status(404).json({msg: error.message})
        }
    })
}

export {
    register,
    login
}