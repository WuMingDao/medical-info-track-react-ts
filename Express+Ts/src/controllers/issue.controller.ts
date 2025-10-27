import type { Request, Response } from "express";
import { db } from "../utils/db.helper.ts";
import { issueTable, staffTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { stat } from "fs";
import { convertTimestampToDateTime } from "../utils/date.helper.ts";

export async function createIssue(req: Request, res: Response) {
  const questTime = convertTimestampToDateTime(res.locals.questTime as string);

  const createDateAsObject = questTime;
  const { poster, description, image } = req.body;

  if (!poster || !description || !image) {
    let message = "Fields missing:";

    if (!poster) message += " poster ";
    if (!description) message += " description ";
    if (!image) message += " image ";

    return res.status(400).json({ status: "failed", message });
  }

  await db.insert(issueTable).values({
    poster,
    createDate: createDateAsObject,
    description,
    image,
  });

  const result = await db.select().from(issueTable);

  console.log(result);

  res.status(201).json({ status: "success", data: result });
}

export async function getIssues(req: Request, res: Response) {
  const id = Number(req.query.id);

  // Find all issue once the id not exists
  if (!id) {
    const result = await db.select().from(issueTable);
    res
      .status(200)
      .json({ status: "success", lenght: result.length, data: result });
  } else {
    const result = await db
      .select()
      .from(issueTable)
      .where(eq(issueTable.id, id));
    res
      .status(200)
      .json({ status: "success", lenght: result.length, data: result });
  }
}

export async function updateIssue(req: Request, res: Response) {
  const { id, staffId, adminId = 0 } = req.body;

  if (!id || !staffId) {
    return res.status(400).json({
      status: "failed",
      message: "Fields missing",
    });
  }

  // check Issue info
  const Issue = await db.select().from(issueTable).where(eq(issueTable.id, id));
  if (Issue.length == 0) {
    return res.status(404).json({
      status: "failed",
      message: "Issue not found",
    });
  }

  const { staffId: issueStaffId, state } = Issue[0];

  if (state === "complete") {
    return res.status(400).json({
      status: "failed",
      message: "Issue already completed",
    });
  }

  let staff;
  let staffRole;

  // check adminId is exists
  if (adminId !== 0) {
    staff = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.id, adminId));
    if (staff.length == 0) {
      return res.status(404).json({
        status: "failed",
        message: "Admin not found",
      });
    }

    staffRole = staff[0].staffRole;
  }

  // admin assign the issue
  if (staff && staffRole === "admin") {
    if (state !== "wait") {
      return res.status(400).json({
        status: "failed",
        message: "cannot assign the issue not wait",
      });
    }

    const result = await db
      .update(issueTable)
      .set({ staffId, state: "fixing" })
      .where(eq(issueTable.id, staffId));

    res.status(200).json({ status: "success", data: result });
  }

  // common staff complete the issue
  if (state !== "fixing" || issueStaffId != staffId) {
    const message =
      state !== "fixing"
        ? "cannot complete the issue not fixing"
        : "mismatch the staff id";

    return res.status(400).json({
      status: "failed",
      message,
    });
  }

  const fixedDate = convertTimestampToDateTime(res.locals.questTime);

  const result = await db
    .update(issueTable)
    .set({ state: "complete", fixedDate })
    .where(eq(issueTable.id, id));

  res.status(200).json({ status: "success", data: result });
}
