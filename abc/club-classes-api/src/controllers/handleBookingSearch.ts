import * as express from "express";
import { IBooking } from "../models/booking";
import { readWriteBookings } from "../utlis/dbMethods/readWriteBooking";
import { readWrite } from "../utlis/dbMethods/readWrite";

const router = express.Router();
async function handleSearch(req: express.Request, res: express.Response){
    const {memberName, startDate, endDate} = req.body;
    
    try{
    //get bookings
    let bookings:IBooking[] = await readWriteBookings.readBookingsFile();

    let filteredBookings = bookings;

    if (memberName) {
        filteredBookings = filteredBookings.filter(booking => booking.memberName.toLowerCase() === (memberName as string).toLowerCase());
    }

    if (startDate || endDate) {
        const start = new Date(!startDate? "0001-01-01": startDate as string);
        const end = new Date(!endDate? "2100-12-31": endDate as string);
        filteredBookings = filteredBookings.filter(booking => {
            const participationDate = new Date(booking.participationDate);
            return participationDate >= start && participationDate <= end;
        });
    }

    //get classes
    let classes = await readWrite.readDataFile();

    const results = filteredBookings.map(booking => {
        const classData = classes.find(cls => cls._id === booking.classId);
        return {
            memberName: booking.memberName,
            className: classData?.name,
            classStartTime: classData?.startTime,
            participationDate: booking.participationDate,
        };
    });

    res.json(results);
}catch(err){
    console.log("search has failed", err);
}
}
router.get('/search', handleSearch);

export default router;