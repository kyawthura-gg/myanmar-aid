import { Hono } from "hono";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export default app;
