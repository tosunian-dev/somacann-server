import express from 'express'
import { getOrders, getPendingOrders, getOrder, changeOrderStatus, searchOrder } from '../controllers/orderController.js'
import checkAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/orders/get/:inicio/:hasta', checkAuth, getOrders)
router.get('/orders/get/pending/', checkAuth, getPendingOrders)
router.get('/orders/get/:id', checkAuth, getOrder)
router.put('/orders/change/:id', checkAuth, changeOrderStatus)
router.get('/orders/search/:filter',  searchOrder)


export default router





