import path from "path";
import fs from 'fs';
import { IBooking } from "../../models/booking";


export class readWriteBookings{

/**
 * reads data from json file
 */
public static async readBookingsFile():Promise<IBooking[]>{ 
    var bookings: IBooking[] = [];
    var bookingsFilePath = path.join(__dirname,'data/bookings.json');
    if (fs.existsSync(bookingsFilePath)) {
        const data = fs.readFileSync(bookingsFilePath, 'utf-8');
        bookings = JSON.parse(data);
    }
    return bookings;
}

/**
 * Write Dta into jsonfile
 */
public static async writeBookingsFile(bookings: IBooking[]):Promise<void>{
    var bookingsFilePath = path.join(__dirname, 'data/bookings.json');
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
}
}