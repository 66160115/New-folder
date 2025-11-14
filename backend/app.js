import express from "express";
import authRouter from "./src/routes/authRoute.js";
import ticketRouter from "./src/routes/ticketRoute.js";
import userRoute from "./src/routes/userRoute.js";
import cors from "cors";

const app = express()
const port = 3000

app.use(cors({
  origin: "http://localhost:4000",
}));

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
