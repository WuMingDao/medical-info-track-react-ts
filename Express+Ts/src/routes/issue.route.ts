import { Router } from "express";
import { createIssue } from "../controllers/issue.controller.ts";

export const issueRoute = Router();

issueRoute.route("/issue").post(createIssue);
