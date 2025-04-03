import express from 'express'
import { products, getOneProduct, addProduct, deleteProduct, editProduct, filteredProducts, getImage, saveVariant, getProductVariants, deleteVariantByStock, addImageInGallery, getGallery, getAllGallery, deleteImgFromGallery, createCategory, getAllCategories, createSubcategory, deleteSubcategory, deleteCategory } from '../controllers/productController.js'
import checkAuth from '../middlewares/authMiddleware.js'
import multipart  from "connect-multiparty"

const router = express.Router()
const mpMiddle = multipart({uploadDir: './uploads/products'});
const mpGalleryMiddle = multipart({uploadDir: './uploads/gallery'});

router.get('/products/:filter?', checkAuth, filteredProducts)
router.get('/products/get/:id', checkAuth, getOneProduct)
router.post('/products/add', [checkAuth, mpMiddle], addProduct)
router.delete('/products/delete/:id', checkAuth, deleteProduct)
router.put('/products/edit/:id', [checkAuth, mpMiddle], editProduct)
router.get('/getImage/:img', getImage )

// VARIANT ROUTES //

router.post('/variants/save', checkAuth, saveVariant)
router.get('/variants/:id', checkAuth, getProductVariants)
router.delete('/variants/variant/:id', checkAuth, deleteVariantByStock)

// GALLERY ROUTES //
router.post('/gallery/add', [checkAuth, mpGalleryMiddle], addImageInGallery)
router.get('/getGallery/:img', getGallery )
router.get('/getAllGallery/:id', checkAuth, getAllGallery)
router.delete('/gallery/delete/:id', checkAuth, deleteImgFromGallery)

// CATEGORY / SUBCATEGORY ROUTES //
router.post('/createCategory', checkAuth, createCategory)
router.get('/getAllCategories', checkAuth, getAllCategories)
router.post('/subcategories/create', checkAuth, createSubcategory)
router.delete('/subcategories/delete/:id', checkAuth, deleteSubcategory)
router.delete('/categories/delete/:id', checkAuth, deleteCategory)




export default router







