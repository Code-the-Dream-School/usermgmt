require('dotenv').config();
const cors = require('cors')
require('express-async-errors')
const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const userRouter = require('./routes/auth')
const connectDB = require('./db/connect');
app.use(cors());
app.use(express.json());
 
app.get('/emailValidate/:token', function (req, res) {
    res.sendFile(__dirname + '/public/emailValidate.html')
});
app.get('/resetPassword/:token', function (req, res) {
    res.sendFile(__dirname + '/public/resetPassword.html')
});
app.use(express.static('./public'))

app.use('/api/v1/users', userRouter)
app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;
app.set('port', port)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();