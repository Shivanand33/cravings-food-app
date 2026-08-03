import express from "express";
import { PartnerProtect, Protect } from "../middlewares/authMiddleware.js";
import {
  RiderGetAvailableOrder,
  RiderGetCompletedOrder,
  RiderGetOngoingOrder,
  RiderAcceptOrder,
  RiderUpdateOrderStatus
} from "../controllers/riderController.js";

const router = express.Router();

router.post("/availableOrder", Protect, PartnerProtect, RiderGetAvailableOrder);
router.get("/ongoingOrder", Protect, PartnerProtect, RiderGetOngoingOrder);
router.get("/completedOrder", Protect, PartnerProtect, RiderGetCompletedOrder);
router.patch("/acceptorder/:id", Protect, PartnerProtect, RiderAcceptOrder);
router.patch("/updateorderstatus/:id", Protect, PartnerProtect, RiderUpdateOrderStatus);

export default router;