import express  from "express"
import connectDB from "./db.js"
import dotenv from "dotenv"
import clientRoutes from "./routes/clientRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import regClientRoutes from "./routes/regClientRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import pagePublicRoutes from "./routes/pagePublicRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import bodyparser from "body-parser"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from 'cors'
import cron from 'node-cron'
import Sale from "./models/Sale.js"

cron.schedule(' 0 0 * * * ', async () => {
  await Sale.deleteMany({status: 'created'})
  console.log('pending sales deleted');
});

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {origin: '*'}
});

io.on("connection", (socket) => {
  socket.on('sendCart', (data) => {
    io.emit('listenCart', data)
  })
});
app.use(express.json())

dotenv.config()

app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

connectDB()

/*app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*'); 
  res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
  res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
  next();
});*/

// Habilitar CORS 
const dominiosPermitidos = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV, process.env.FRONTEND_PAGE_URL, process.env.FRONTEND_URL_DEV_2]

app.use(cors({origin: dominiosPermitidos, credentials: true}))
//
const PORT = process.env.PORT || 4000

httpServer.listen(PORT, () => {
    console.log(`Server at port ${PORT}`)
})

app.use('/api', adminRoutes)
app.use('/api', clientRoutes)
app.use('/api', productRoutes)
app.use('/api', pagePublicRoutes)
app.use('/api', regClientRoutes)
app.use('/api', orderRoutes)