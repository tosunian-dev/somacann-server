import Product from "../models/Product.js";
import Variant from "../models/Variant.js";
import ProductGallery from "../models/ProductGallery.js";
import Shipping from "../models/Shipping.js"
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import USDSettings from "../models/USDSettings.js"
import USDLogs from "../models/USDLogs.js"
import axios from 'axios'
import Gallery from "../models/ProductGallery.js";

const getLatestProducts = async (req, res) => {
    const latestProducts = await Product.find().sort({createdAt: -1}).limit(4)
    const latestProductsImages = []

    for(const product of latestProducts){
        const images = await Gallery.find({product: product._id})
        if(images.length > 0 && product.subcategory === 'CAPSULAS' || 'Capsulas'){
            if(images[1]){
                latestProductsImages.push({
                    productId: product._id,
                    name: product.name,
                    image: images[1].image,
                    slug: product.slug
                })
            }
        }

    }

    res.status(200).json(latestProductsImages)
}

const getMostWantedProducts = async (req, res) => {
    const latestProducts = await Product.aggregate([{$sample: {size: 4}}])
    res.status(200).json(latestProducts)
}

const getAllProducts = async (req, res) => {
    const productsData = []
    const latestProducts = await Product.find({forSale: true});//.sort({createdAt: -1})
    
    //for(const product of latestProducts){
    //    const variants = await Variant.find({product: product._id})
    //    productsData.push({
    //        name: product.name ,
    //        category: product.category,
    //        subcategory: product.subcategory,
    //        price: product.price,
    //        image: product.image,
    //        discount: product.discount,
    //        description: product.description,
    //        seller: product.seller,
    //        slug: product.slug,
    //        forSale: product.forSale ,
    //        str_variant: product.str_variant,
    //        createdAt: product.createdAt,
    //        variants
    //    })
    //}

    res.status(200).json(latestProducts)
}

const getAllCategories = async (req, res) => {
    const {name} = req.body
    try {
        const allCategories = await Category.find().sort({name : 1})
        const categories = []

        for(const item of allCategories){
            const subcategories = await Subcategory.find({category: item._id})  
            const products = await Product.find({category: item.name})

            categories.push({
                category: item,
                subcategories,
                qOfProducts: products.length
            })
        }

        return res.json(categories)
    } catch (error) {
        res.status(404).json({msg: 'No se encontró la categoria'})
    }
}

const getOneProduct = async (req, res) => {
    const {slug} = req.params
    const product = await Product.find({slug: slug})
    if(!product) {
        return res.status(404).send({msg: "Producto no encontrado"})
    }
    if( product[0] ){
        const variants = await Variant.find({product: product[0]._id})
        const gallery = await ProductGallery.find({product: product[0]._id})
        return res.status(200).json({product, variants, gallery})
    }
    
}

const getRelatedProducts = async (req, res) => {
    const {category} = req.params
    const products = await Product.find({category: category}).limit(6)
    return res.status(200).json({products})
}

const getCategories = async (req, res) => {
    const categories = await Category.find()
    const subcategories = await Subcategory.find()
    return res.status(200).json({categories,subcategories})
}

const filteredProducts = async (req, res) => {
    const filter = req.params['filter']
    const products = await Product.find({
        $or: [
            {name: new RegExp(filter, 'i')},
            {category: new RegExp(filter, 'i')}
        ]
    }).sort({createdAt: -1})
    res.json({products})
}

const getShippingData = async (req, res) => {
    const shippingData = await Shipping.find()
    return res.status(200).send(shippingData)
}

// USD VALUE FUNCTIONS //

const getUSDSettings = async (req, res) => {
    const USDValue = await USDSettings.find()
    return res.status(200).json(USDValue)
}

export {
    getLatestProducts,
    getMostWantedProducts,
    getAllProducts,
    getAllCategories,
    getOneProduct,
    getRelatedProducts,
    getCategories,
    filteredProducts,
    getShippingData,
    getUSDSettings,
}