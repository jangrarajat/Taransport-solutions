import { Router } from "express";
import { expantion, getExpantions } from "../controllers/otherExpantion.js";
import verigyJwt from "../middleware/verify.jwt.js";
const route = Router();

route.post('/expantion', verigyJwt, expantion)

route.get('/get-expantion', verigyJwt, getExpantions)

export default route;