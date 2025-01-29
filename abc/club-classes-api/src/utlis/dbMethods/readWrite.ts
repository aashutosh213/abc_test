import path from "path";
import fs from 'fs';
import { IClass } from "../../models/class";


export class readWrite{
    
 //reads data from json file
public static async readDataFile():Promise<IClass[]>{ 
    var classes: IClass[] = [];
    var classesFilePath = path.join(__dirname,'data/classes.json');
    if (fs.existsSync(classesFilePath)) {
        const data = fs.readFileSync(classesFilePath, 'utf-8');
        classes = JSON.parse(data);
    }
    return classes;
}

 //Write Dta into jsonfile
public static async writeDataFile(classes: IClass[]):Promise<void>{
    var classesFilePath = path.join(__dirname, 'data/classes.json');
    fs.writeFileSync(classesFilePath, JSON.stringify(classes, null, 2));
}
}