import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { AdminController } from "./admin.contoller";


const router = Router();


router.get(
  "/users",
  auth(Role.ADMIN),
  AdminController.getAllUsers
);


router.patch(
  "/users/:id/block",
  auth(Role.ADMIN),
  AdminController.blockUser
);


router.patch(
  "/users/:id/unblock",
  auth(Role.ADMIN),
  AdminController.unblockUser
);


router.get(
  "/dashboard-stats",
  auth(Role.ADMIN),
  AdminController.getDashboardStats
);
router.get(
  "/audit-logs",
  auth(Role.ADMIN),
  AdminController.getAuditLogs
);

export const AdminRoutes = router;