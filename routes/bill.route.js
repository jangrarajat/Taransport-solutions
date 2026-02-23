import { Router } from "express";
import { addBillEntry, getBiity, getPetrolPump, updatePetrolPumpPaymentStatus } from "../controllers/bill.controllers.js";
import verigyJwt from "../middleware/verify.jwt.js";
const route = Router();


route.post('/add-bill-entry', verigyJwt, addBillEntry)

route.get('/get-bills', verigyJwt, getBiity)

route.get('/get-petrolPumps', verigyJwt, getPetrolPump)

route.put('/update-petrolpump-payment/:id', verigyJwt, updatePetrolPumpPaymentStatus)

export default route;