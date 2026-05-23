import router from "./api/Router.mjs";
import express, { json } from "express";

const app = express();

app.use(json());
app.use("/v1", router);

export default app;