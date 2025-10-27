import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { issueTable } from "../db/schema.ts";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const issue: (typeof issueTable.$inferInsert)[] = [
    {
      poster: "John Doe",
      createDate: new Date("2023-01-14"), // "2023-01-15",
      description: "The login button on the homepage is not clickable.",
      image: "https://example.com/images/login_button_issue.png",
      state: "wait", // <--- 修改为 "wait",
      staffId: 101,
    },
    {
      poster: "Jane Smith",
      createDate: new Date("2023-01-15"), // "2023-01-16",
      description: "User profile page shows incorrect data for email field.",
      image: "https://example.com/images/profile_email_error.jpg",
      state: "fixing", // <--- 修改为 "fixing"
      staffId: 102,
    },
    {
      poster: "Peter Jones",
      createDate: new Date("2023-01-16"), // "2023-01-17",
      description: "Application crashes when uploading files larger than 5MB.",
      image: "https://example.com/images/file_upload_crash.mp4",
      state: "complete", // <--- 修改为 "complete"
      fixedDate: "2023-01-20",
      staffId: 103,
    },
  ];

  await db.insert(issueTable).values(issue);
  console.log("New user created!");

  const users = await db.select().from(issueTable);
  console.log("Getting all users from the database: ", users);
}

main();
