import type { Request, Response } from "express";
import { db } from "../utils/db.helper.ts";
import { issueTable } from "../db/schema.ts";

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
