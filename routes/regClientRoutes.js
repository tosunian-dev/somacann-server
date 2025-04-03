import express from 'express'
import { createCart, getCart, deleteItemFromCart, saveAddress, getAddressData, deleteAddress, getSaleAfterPayment, createSale, getOrderData, getOrders, getShippingMethods, saleVerification } from '../controllers/regClientController.js'
import checkClientAuth from '../middlewares/clientAuthMiddleware.js'

const router = express.Router()

// CART ROUTES //
router.post('/cart/create', checkClientAuth, createCart)
router.get('/cart/get/:user', checkClientAuth, getCart)
router.delete('/cart/delete/:id', checkClientAuth, deleteItemFromCart)

// CUSTOMER PROFILE CONFIG ROUTES //
router.put('/profile/saveAddress/:id?', checkClientAuth, saveAddress)
router.get('/profile/getAddress/:id', checkClientAuth, getAddressData)
router.delete('/profile/deleteAddress/:id', checkClientAuth, deleteAddress)
router.get('/profile/order/:id', checkClientAuth, getOrderData)
router.get('/profile/orders/:id', checkClientAuth, getOrders)

// SALE ROUTES //
router.get('/sales/get/:payment_id', checkClientAuth, getSaleAfterPayment)
router.get('/shipping/methods/:id', checkClientAuth, getShippingMethods)
router.post('/sales/save', checkClientAuth, createSale)

// WEBHOOK ROUTES //
router.post('/sales/webhook', saleVerification)

export default router
