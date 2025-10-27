import type { Request, Response } from "express";
import { db } from "../utils/db.helper.ts";
import { staffTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export async function createStaff(req: Request, res: Response) {
  const { staffName, password } = req.body;

  if (!staffName || !password) {
    res.status(400).json({
      status: "failed",
      message: "Fields missing",
    });
  }

  await db.insert(staffTable).values({
    staffName,
    staffRole: "staff",
    password,
  });

  res.status(201).json({
    status: "success",
    data: {
      staffName,
      password,
    },
  });
}

export async function getStaff(req: Request, res: Response) {
  const id = Number(req.query.id);

  if (!id) {
    const result = await db.select().from(staffTable);
    res
      .status(200)
      .json({ status: "success", length: result.length, data: result });
  } else {
    const result = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.id, id));
    res.status(200).json({ status: "success", data: result });
  }
}
