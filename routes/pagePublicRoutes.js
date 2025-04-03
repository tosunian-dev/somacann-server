import express from 'express'
import { getLatestProducts, getMostWantedProducts, getAllProducts, getAllCategories, getOneProduct, getRelatedProducts, getCategories, filteredProducts, getShippingData, getUSDSettings } from '../controllers/pagePublicController.js'

const router = express.Router()

router.get('/public/getLatestProducts', getLatestProducts)
router.get('/public/getMostWantedProducts', getMostWantedProducts)
router.get('/public/getAllProducts', getAllProducts)
router.get('/public/getallcategories', getAllCategories)
router.get('/public/getoneproduct/:slug', getOneProduct)
router.get('/public/getrelatedproducts/:category', getRelatedProducts)
router.get('/public/getcategories', getCategories)
// SEARCH ROUTE //
router.get('/products/:filter?', filteredProducts)
router.get('/getshippingdata', getShippingData)
// USD VALUE //
router.get('/public/getusdsettings', getUSDSettings)


export default router


