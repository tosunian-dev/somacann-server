import express from 'express'
import { login, register, getEmployees, getOneEmployee, editEmployee, disableEmployee, saveShippingSettings, getShippingSettings, getClientsLength, getSalesLength, getAllClients, getClientDetails, updateUSDSettings, getUSDSettings, getUSDLogs } from '../controllers/adminController.js'
import checkAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

// EMPLOYEES ROUTES //
router.post('/login', login)
router.post('/createadmin', checkAuth, register)
router.get('/employees', checkAuth, getEmployees)
router.get('/employees/:id', checkAuth, getOneEmployee)
router.post('/confirmedit/:id', checkAuth, editEmployee)
router.put('/disable/:id', checkAuth, disableEmployee)

// SHIPPING SETTINGS ROUTES //
router.post('/config/shipping', checkAuth, saveShippingSettings)
router.get('/config/shipping/get/:id', checkAuth, getShippingSettings)

// HOME DATA //
router.get('/homedata/getclientslength', checkAuth, getClientsLength)
router.get('/homedata/getsaleslength', checkAuth, getSalesLength)

// CLIENTS LIST //
router.get('/clients/getall', checkAuth, getAllClients)
router.get('/clients/:id', checkAuth, getClientDetails)

// USD SETTINGS //
router.put('/config/usdsettings', checkAuth, updateUSDSettings)
router.get('/config/getusdsettings', checkAuth, getUSDSettings)
router.get('/config/getusdlogs', checkAuth, getUSDLogs)
export default router


