import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { UserRoutes } from "./modules/user/user.route";
import { BloodRequestRoutes } from "./modules/bloodRequest/bloodRequest.route";
import { DonationRoutes } from "./modules/donation/donation.route";
import { PaymentRoutes } from "./modules/payment/payment.route";
import { DonorRoutes } from "./modules/donor/donor.route";
import { AdminRoutes } from "./modules/admin/admin.route";


const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/admin", AdminRoutes);
router.use("/blood-requests", BloodRequestRoutes);
router.use("/donors", DonorRoutes);
router.use("/donations", DonationRoutes);
router.use("/payments", PaymentRoutes);
export default router;