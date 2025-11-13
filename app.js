import express from "express";
import authRouter from "./src/routes/authRoute.js";

const app = express()
const port = 3000

app.use(express.json());

app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
