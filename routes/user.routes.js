import { Router } from "express";
import { login, logout, registration, refreshExpriedToken, getTotalRevenue } from "../controllers/user.controllers.js";
import verigyJwt from "../middleware/verify.jwt.js";
const route = Router();

route.post("/registration", registration);
route.post("/login", login);
route.post("/logout", verigyJwt, logout)
route.post("/refresh-token", refreshExpriedToken)

route.get("/dashbord", verigyJwt, getTotalRevenue)

export default route;