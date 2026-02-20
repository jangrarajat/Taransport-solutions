import { Router } from "express";
import { addBillEntry } from "../controllers/bill.controllers.js";
import verigyJwt from "../middleware/verify.jwt.js";
const route = Router();


route.post('/add-bill-entery', verigyJwt, addBillEntry)

export default route;