const express = require('express');

// internal libraries
// ensure databse is connected. 
require('./db/mongoose');

// routers 
const userRouter = require('./routers/users.router');
const taskRouter = require('./routers/task.router');

// variables
const app = express();
const PORT = process.env.PORT || 3000; // this env is provided by heroku

// middlewares
// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down. Check back soon"); 

// if (req.method === "GET") {
//     res.send('GET requests are disabled');
// } else {
//     next();
// }
// });

app.use(express.json());

// routes
app.use(userRouter);
app.use(taskRouter);


app.listen(PORT, () => {
    console.log(`Server is up on ${PORT}`);
});