"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routers/auth"));
const password_1 = __importDefault(require("./routers/password"));
const schema_1 = __importDefault(require("./routers/schema"));
const user_1 = require("./routers/user");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";
const corsOptions = {
    origin: isProduction ? process.env.CLIENT_PROD_URL : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    preflightContinue: false,
    optionsSucessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// Disable X-Powered-By Header
app.disable("x-powered-by");
app.set("trust proxy", true);
// Schema router - to create schemas
app.use(schema_1.default);
// Auth Router
app.use("/auth/v1/", auth_1.default);
// Users Router
app.use("/api/v1/", user_1.userRouter);
// Passwords router
app.use("/api/v1/", password_1.default);
app.get("/", (req, res) => {
    res.status(200).json("Server is Live");
});
app.listen(port, () => {
    console.log("Server listening at port " + port);
});
//# sourceMappingURL=index.js.map