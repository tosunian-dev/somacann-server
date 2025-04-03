import jwt from "jsonwebtoken"

const JWTGen = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "99999d"
    })
}

export default JWTGen