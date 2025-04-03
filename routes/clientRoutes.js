import express from 'express'
import { register, login } from '../controllers/clientController.js'

const router = express.Router()

router.post('/loginClient', login)
router.post('/register', register)














export default router







