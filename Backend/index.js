const express = require("express");


const app= express();
const connectToMongo = require("./Db");

connectToMongo();

app.use(express.json());

app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));

app.listen(3000,()=>
{
    console.log("Hrllo msi aa gya");
})