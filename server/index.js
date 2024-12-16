// ================= import library // =================
import express from "express"
import cookieParser from "cookie-parser"
import env from "dotenv"
import bodyParser from "body-parser"
import Cors from "cors"
import passport from "./config/passport.js"
// ================= import library // =================

// ================= import routes backend // =================
import UsersRoute from "./routes/UsersRoute.js"
import RolesRoute from "./routes/RolesRoute.js"
import DrugsRoute from "./routes/DrugsRoute.js"
import PatientsRoute from "./routes/PatientsRoute.js"
import MedicalRecordsRoute from "./routes/MedicalRecordsRoute.js"
import DashboardRoute from "./routes/DashboardRoute.js"
import SitesRoute from "./routes/SitesRoute.js"
import SlidersRoute from "./routes/SlidersRoute.js"

// ================= import routes backend // =================


// ================= import routes auth // =================
import AuthRoute from "./routes/AuthRoute.js"
import RefreshTokenRoute from "./routes/RefreshTokenRoute.js"
import ProfileRoute from "./routes/ProfileRoute.js"
import GoogleAuthRoute from "./routes/GoogleAuthRoute.js"
// ================= import routes  auth // =================

// ================= import models // =================
import Database from "./config/Database.js"
// ================= import models // =================

// ================= import widdleware // =================
import CreateError from "./middleware/CreateError.js"
import session from "express-session"
import { Drugs, ImageProducts, MedicalRecords, Patients, Roles, User_Role, Users, UsersDetails } from "./models/Index.js"
import Sites from "./models/_models/Sites.js"
import Slider from "./models/_models/Slider.js"

// ================= import middleware // =================

// ================= express // =================
env.config()
const app = express()
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }))
// ================= express // =================

// ================= passport // =================
app.use(passport.initialize())
app.use(passport.session())
// ================= passport // =================

// ================= cors akses url // =================
let whitelist = ['http://localhost:5173',"https://091b-103-166-158-39.ngrok-free.app"]
let corsOpt = function (req, callback) {
    let corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true ,credentials: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false, credentials: true } // disable CORS for this request
    }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
// ================= cors akses url // =================

// ================= db sync // =================
const _run =  () => {
    console.log("// ==================== APP-RES ==================== //")
    Database.query("SET FOREIGN_KEY_CHECKS = 0").then(async () =>{
        // await Roles.sync({ force: true })
        // await Users.sync({ force: true })
        // await UsersDetails.sync({ force: true })
        // await User_Role.sync({ force: true })
        // await ImageProducts.sync({ force: true })
        // await Drugs.sync({ force: true })
        // await Patients.sync({ force: true })
        // await MedicalRecords.sync({ force: true })
        // await Sites.sync({ force: true })
        // await Slider.sync({ force: true })
    })
    .catch(err=> console.log("ERROR SYNC DATABASE ", err))
    .finally(()=>{
      console.log("// ==================== APP-RES ==================== //")
    })
}

_run()

// ================= db sync // =================

// ================= express config // =================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json())
app.use(Cors(corsOpt))
// ================= express config // =================

// ================= express config statis file// =================
app.use("/products",express.static("./public/products"))
app.use("/sites",express.static("./public/sites"))
app.use("/profile",express.static("./public/profile"))
app.use("/slider",express.static("./public/slider"))
// ================= express config statis file// =================

// ================= routes auth // =================
app.use("/api/",AuthRoute,GoogleAuthRoute)
// ================= routes auth // =================

// ================= routes backend // =================
app.use("/api",
    UsersRoute,
    RolesRoute,
    DrugsRoute,
    PatientsRoute,
    MedicalRecordsRoute,
    DashboardRoute,
    SitesRoute,
    SlidersRoute,
    ProfileRoute
)
// ================= routes backend // =================

// ================= routes refreshtoken // =================
app.use("/api",RefreshTokenRoute)
// ================= routes refreshtoken // =================


// ================= middleware error // =================
app.use(CreateError)
// ================= middleware error // =================

// ================= express server // =================
app.listen(process.env.APP_PORT,()=>{
    console.log("Server runing in port "+process.env.APP_PORT)
    console.log("// ==================== APP-RES ==================== //")
    // console.log(Buffer.from("SB-Mid-server-ZnZ4O_4AlBZ-P9yh3kCjhB_o").toString("base64"));
    
})
// ================= express server // =================
