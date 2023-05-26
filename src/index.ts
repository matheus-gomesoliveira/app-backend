import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import addressRoutes from "routes/AddressRoute"
import accountRoutes from "routes/AccountRoute"
import onboardingRoutes from "routes/OnboardingRoute"
import transferRoutes from "routes/TransferRoute"
import { DateTime } from "luxon";

DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello Fabio");
});

app.use("/account", accountRoutes)
app.use("/balance", accountRoutes)
app.use("/transfer", transferRoutes)
app.use("/extract", transferRoutes)
// app.use("/transfer", authentication, transferRoutes)
app.use("/login", usersRoutes)
app.use("/register", onboardingRoutes)
app.use("/address", addressRoutes)
app.use("/users", usersRoutes);
app.listen(process.env.PORT || 3344);
