const express = require('express');
require('./config/database');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/userRouter');
const PORT = process.env.PORT
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(productRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
});