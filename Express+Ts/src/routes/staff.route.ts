import { Router } from "express";
import { createStaff, getStaff } from "../controllers/staff.controller.ts";

export const staffRoute = Router();

staffRoute.route("/staff").post(createStaff).get(getStaff);
