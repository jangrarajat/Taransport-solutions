import { Router } from "express";
import { addBillEntry, getBiity } from "../controllers/bill.controllers.js";
import verigyJwt from "../middleware/verify.jwt.js";
const route = Router();


route.post('/add-bill-entry', verigyJwt, addBillEntry)

route.get('/get-bills', verigyJwt, getBiity)


export default route;