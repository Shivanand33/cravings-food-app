import express from "express";
import {
  GetAdminStats,
  GetAllUsers,
  GetAllOrdersAdmin,
  UpdateUserRoleAdmin,
} from "../controllers/adminController.js";
import { Protect, AdminProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", Protect, AdminProtect, GetAdminStats);
router.get("/users", Protect, AdminProtect, GetAllUsers);
router.get("/orders", Protect, AdminProtect, GetAllOrdersAdmin);
router.patch("/userRole/:id", Protect, AdminProtect, UpdateUserRoleAdmin);

export default router;
