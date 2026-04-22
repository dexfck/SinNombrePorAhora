import express from "express"
import mainRoutes from "./routes/main.routes.js"
import loginRoutes from "./routes/login.routes.js"

const app = express()

app.use(express.json())

app.use("/", mainRoutes)
app.use("/login", loginRoutes)

export default app
