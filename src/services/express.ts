/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.status(200).json({
    test: "asdas",
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
