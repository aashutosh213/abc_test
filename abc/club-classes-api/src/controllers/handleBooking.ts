import * as express from "express";
import { IBooking } from "../models/booking";
import { readWriteBookings } from "../utlis/dbMethods/readWriteBooking";
import { readWrite } from "../utlis/dbMethods/readWrite";
import { IClass } from "../models/class";
import { ObjectID } from "bson";

const router = express.Router();


async function handleGetBookings(req:express.Request, res:express.Response) {
    try{
    const bookings: IBooking[] = await readWriteBookings.readBookingsFile();
    res.json(bookings);
    }catch(err){
        console.error("unable to get bookings", err);
        return res.status(500).json({error:err});
    }
}

async function handlePostBooking(req :express.Request, res :express.Response){
    const booking:IBooking = req.body;

    try{
    // Validations
    if(!booking.memberName){
        return res.status(400).json({ error: "Memeber name is not a valid name" });
    }
    const participationDateObj = new Date(booking?.participationDate);
    const now = new Date();

    if (participationDateObj <= now) {
        return res.status(400).json({ error: "Participation date must be in the future" });
    }

    // Check if class present
    const classes: IClass[] = await readWrite.readDataFile();
    const classDataIndex = classes.findIndex(cls => cls._id === booking?.classId);
    if (classDataIndex == -1) {
        return res.status(404).json({ error: "Class not found" });
    }

    // Check if booking exceeding the capacity
    if (classes[classDataIndex].bookings >= classes[classDataIndex].capacity) {
        return res.status(400).json({ error: "Class capacity exceeded" });
    }
    booking._id = new ObjectID().toString();
    const bookings: IBooking[] = await readWriteBookings.readBookingsFile();
    bookings.push(booking);
    classes[classDataIndex].bookings++;

    //sending data to file DB
    await readWrite.writeDataFile(classes);
    await readWriteBookings.writeBookingsFile(bookings);

    return res.status(200).json(booking);
}catch(err){
    console.error("booking failed", err);
    return res.status(500).json({error: err});
}
}

router.get('/bookings', handleGetBookings);
router.post('/bookings', handlePostBooking);

export default router;
