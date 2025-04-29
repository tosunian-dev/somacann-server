import Admin from "../models/AdminUser.js";
import Sale from "../models/Sale.js";
import Client from "../models/ClientUser.js";
import Address from "../models/Address.js";
import JWTGen from "../helpers/JWTGen.js";
import Shipping from "../models/Shipping.js";
import USDSettings from "../models/USDSettings.js";
import USDLogs from "../models/USDLogs.js";

// EMPLOYEES SETTINGS FUNCTIONS //

const login = async (req, res) => {
  const { name } = req.body;
  // Check user existence
  const admin = await Admin.findOne({ name });
  const admins = await Admin.find();

  if (!admin) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Check if admin is allowed
  if (!admin.enabled) {
    const error = new Error("Tu cuenta no está habilitada");
    return res.status(404).json({ msg: error.message });
  }

  // Check password
  const { password } = req.body;
  if (password !== admin.password) {
    const error = new Error("Contraseña incorrecta");
    return res.status(404).json({ msg: error.message });
  } else {
    res.status(200).json({
      token: JWTGen(admin.id),
      name: admin.name,
      _id: admin._id,
    });
  }
};

const register = async (req, res) => {
  const { name } = req.body;

  // Prevenir usuarios duplicados
  const usuarioExiste = await Admin.findOne({ name });

  if (usuarioExiste) {
    const error = new Error("Este usuario ya existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const admin = new Admin(req.body);
    admin.password = "admin"; // Contraseña por defecto
    admin.enabled = true; // Activado por defecto
    const savedAdmin = await admin.save();

    res.json(savedAdmin);
  } catch (error) {
    console.log(error);
  }
};

const getEmployees = async (req, res) => {
  const employees = await Admin.find();
  return res.status(200).json(employees);
};

const getOneEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Admin.findById(id);
    return res.status(200).json(employee);
  } catch (error) {
    return res
      .status(404)
      .json({ msg: "Empleado no encontrado" })
      .send(undefined);
  }
};

const editEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Admin.findById(id);

  if (!employee) {
    return res.status(404).json({ msg: "Empleado no encontrado" });
  }

  employee.name = req.body.name || employee.name;
  employee.password = req.body.password || employee.password;
  employee.userType = req.body.userType || employee.userType;
  employee.companyName = req.body.companyName || employee.companyName;
  employee.userName = req.body.userName || employee.userName;
  employee.email = req.body.email || employee.email;

  try {
    const editedEmployee = await employee.save();
    return res.json(editedEmployee);
  } catch (error) {
    console.log(error);
  }
};

const disableEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Admin.findById(id);

  if (!employee) {
    return res.status(404).json({ msg: "Empleado no encontrado" });
  }

  if (employee.enabled === true) {
    employee.enabled = false;
  } else {
    employee.enabled = true;
  }

  try {
    const editedEmployee = await employee.save();
    return res.json(editedEmployee);
  } catch (error) {
    console.log(error);
  }
};

// SHIPPING SETTINGS FUNCTIONS //

const saveShippingSettings = async (req, res) => {
  const settings = new Shipping(req.body);

  const existSettings = await Shipping.find({ seller: settings.seller });
  if (existSettings.length === 0) {
    try {
      const newSettings = await settings.save();
      return res.status(200).json(newSettings);
    } catch (error) {
      return res.status(404).json({ msg: "No se pudo guardar cambios." });
    }
  }

  try {
    const updated = await Shipping.findOneAndUpdate(
      { seller: settings.seller },
      {
        toAddress: req.body.toAddress,
        toShipperBranch: req.body.toShipperBranch,
        toBranch: req.body.toBranch,
        freeShippingAmount: req.body.freeShippingAmount,
        message: req.body.message,
        shippingCompany: req.body.shippingCompany,
      }
    );
    return res.status(200).json({ msg: "Actualizado" });
  } catch (error) {
    console.log(error);
  }
};

const getShippingSettings = async (req, res) => {
  const { id } = req.params;

  const settings = await Shipping.find({ seller: id });
  return res.status(200).json(settings);
};

const getClientsLength = async (req, res) => {
  const clients = await Client.find();
  return res.status(200).json(clients.length);
};

const getSalesLength = async (req, res) => {
  const sales = await Sale.find({ status: "approved" });
  return res.status(200).json(sales);
};

const getAllClients = async (req, res) => {
  const clients = await Client.find();
  return res.status(200).json(clients);
};

const getClientDetails = async (req, res) => {
  const { id } = req.params;

  const clientData = await Client.findOne({ _id: id });
  const clientPurchases = await Sale.find({ client: id });
  const clientAddresses = await Address.find({ client: id });

  res.status(200).json({ clientData, clientPurchases, clientAddresses });
};

// USD SETTINGS FUNCTIONS //

const updateUSDSettings = async (req, res) => {
  const USDValue = await USDSettings.find();
  const USDLogValues = {
    value: req.body.value,
    enabled: req.body.enabled,
  };
  const USDLog = new USDLogs(USDLogValues);
  USDLog.createdAt = Date.now();
  await USDSettings.findOneAndUpdate(
    { _id: USDValue[0]._id },
    {
      value: req.body.value,
      enabled: req.body.enabled,
      updatedAt: Date.now(),
    }
  );
  await USDLog.save();
  return res.status(200).json({ msg: "Actualizado" });
};

const getUSDSettings = async (req, res) => {
  const USDValue = await USDSettings.find();
  return res.status(200).json(USDValue);
};

const getUSDLogs = async (req, res) => {
  const USDLogsList = await USDLogs.find().sort({ createdAt: -1 });
  return res.status(200).json(USDLogsList);
};

export {
  login,
  register,
  getEmployees,
  getOneEmployee,
  editEmployee,
  disableEmployee,
  saveShippingSettings,
  getShippingSettings,
  getClientsLength,
  getSalesLength,
  getAllClients,
  getClientDetails,
  updateUSDSettings,
  getUSDSettings,
  getUSDLogs,
};
