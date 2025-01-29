import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createClass from './controllers/createClass';
import handleBooking from './controllers/handleBooking';
import handleBookingSearch from './controllers/handleBookingSearch';


//port or process.ENV.PORT
const PORT = 3001;
//using modules
const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Api routing
app.use('/api/createClasses', createClass);
app.use('/api/bookings', handleBooking);
app.use('api/memberData', handleBookingSearch);

//default route can be handled later on in case of cleaning the data files if needed
app.get('/', (req:Request, res:Response) => {
    return res.status(200).json({message:'Api is at endpoint /'});
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

