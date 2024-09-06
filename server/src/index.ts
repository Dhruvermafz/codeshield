import express, {Request, Response} from "express"
import dotenv from "dotenv"
import cors from "cors"



dotenv.config()

const app  =  express()

app.use(express.json())

const port = process.env.PORT || 8080;

const isProduction = process.env.NODE_ENV === "production"

const corsOptions = {
    origin: isProduction ? process.env.CLIENT_PROD_URL : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    preflightContinue: false,
    optionsSucessStatus: 200,
}

app.use(cors(corsOptions));

// Disable X-Powered-By Header
app.disable("x-powered-by");

app.set("trust proxy", true);

// Schema router - to create schemas
app.use(schemaRouter);

// Auth Router
app.use("/auth/v1/", authRouter);

// Users Router
app.use("/api/v1/", userRouter);

// Passwords router
app.use("/api/v1/", passwordRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Server is Live");
});

app.listen(port, () => {
  console.log("Server listening at port " + port);
});
