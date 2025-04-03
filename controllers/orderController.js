import Sale from '../models/Sale.js'
import Client from '../models/ClientUser.js'
import SaleDetail from '../models/SaleDetail.js'
import Address from '../models/Address.js'

const getOrders = async (req, res) => {
    const inicio = req.params['inicio']
    const hasta = req.params['hasta']

    const orders = await Sale.find({
        createdAt:{
            $gte: new Date(inicio+'T00:00:00'),
            $lt: new Date(hasta+'T00:00:00')
        },
        status: 'approved'
    }).populate('client').populate('address')
    res.json(orders)
}

const getPendingOrders = async (req, res) => {
    const {statusStr} = req.params

    const orders = await Sale.find({statusStr: 'En preparación', status:'approved'}).sort({createdAt: -1}).populate('client').populate('address')
    return res.status(200).json(orders)
}

const getOrder = async (req, res) => {
    const {id} = req.params

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const order = await Sale.find({_id: id}).populate('client').populate('address')
        const details = await SaleDetail.find({sale: id}).populate('product')
        return res.status(200).json({order, details})
    } else {
        return res.status(200).json({msg:'El ID del pedido es incorrecto.'})
    }

}

const changeOrderStatus = async (req, res) => {
    const {id} = req.params
    const {status, trackingCode} = req.body
    const order = await Sale.findByIdAndUpdate(id, {statusStr: status, trackingCode})
    return res.status(200).json({msg: 'Estado cambiado'})
}

const searchOrder = async (req, res) => {
    const filter = req.params['filter']
    if(filter.match(/^[0-9a-fA-F]/)){
        const order = await Sale.find({orderNumber: filter}).populate('client')
        if(order.length >= 1){
            return res.status(200).json(order)  
        } 
        return res.status(200).json({msg:'No se encontró un pedido con ese número'})
    }
   
}


export {
    getOrders,
    getPendingOrders,
    getOrder,
    changeOrderStatus,
    searchOrder
}





















































