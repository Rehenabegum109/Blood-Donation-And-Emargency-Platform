import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { UserRoutes } from "./modules/user/user.route";
import { BloodRequestRoutes } from "./modules/bloodRequest/bloodRequest.route";
import { DonationRoutes } from "./modules/donation/donation.route";


const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/blood-requests", BloodRequestRoutes);
router.use("/donations", DonationRoutes);

export default router;