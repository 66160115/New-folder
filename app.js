import express from "express";
import authRouter from "./src/routes/authRoute.js";
import ticketRouter from "./src/routes/ticketRoute.js";
import userRoute from "./src/routes/userRoute.js";

const app = express()
const port = 3000

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/users", userRoute);
app.use("/uploads", express.static("uploads"));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
