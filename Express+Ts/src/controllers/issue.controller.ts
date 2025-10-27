import type { Request, Response } from "express";
import { db } from "../utils/db.helper.ts";
import { issueTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export async function createIssue(req: Request, res: Response) {
  const questTime = new Date(res.locals.questTime);

  const createDateAsObject = questTime;
  const { poster, description, image } = req.body;

  if (!poster || !description || !image) {
    let message = "Fields missing:";

    if (!poster) message += " poster ";
    if (!description) message += " description ";
    if (!image) message += " image ";

    res.status(400).json({ status: "failed", message });

    return false;
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
