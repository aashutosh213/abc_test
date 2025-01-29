import * as express from "express";
import { IClass } from "../models/class";
import { readWrite } from "../utlis/dbMethods/readWrite";
import { ObjectId } from "bson";

var router = express.Router();

async function handleGetClasses(req :express.Request, res :express.Response){
    const pageNum: number = req.query.pageNum ? parseInt(req.query.pageNum.toString(), 10) || 1 : 1;
    const pageSize: number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) || 20 : 20;
    const startRow: number = (pageNum - 1) * pageSize;
    const inactive: boolean = req.query.isActive === "False";
    try{
    const classes :IClass[] = await readWrite.readDataFile();

    
    const sorted = classes.sort((a, b) => a._id.localeCompare(b._id));
    const filtered = sorted.filter(x => x.active !== inactive); 

    if(startRow > filtered.length){
        return res.status(400).json({error:"The Size requested is out of bounds"});
    }
    var resClasses = filtered.splice(startRow, pageSize);

    let response: any = {};
    Object.assign(response, {
        classes: resClasses,
        totalCount: filtered.length + resClasses.length
    });

    return res.status(200).json(response);
}catch(err){
    console.error("failed to get classes", err);
    return res.status(500).json({error: err});
}

}

async function handleAddClass(req: express.Request, res:express.Response){
    if(!req.body){
        return res.status(400).json({ error: "No Data present" });
    }
    const newClass = req.body as IClass;

    // Validation
    if (!newClass.name || !newClass.startDate || !newClass.endDate || !newClass.startTime || !newClass.duration || newClass.capacity === 0) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (newClass.capacity < 1) {
        return res.status(400).json({ error: "Capacity must be at least 1" });
    }
    try{
    const start = new Date(newClass.startDate);
    const end = new Date(newClass.endDate);
    const now = new Date();

    if (end <= now) {
        return res.status(400).json({ error: "End date must be in the future" });
    }

    var classes :IClass[] = await readWrite.readDataFile();
    var classNamePresent = classes.some(c => c.name === newClass.name)
    if(classNamePresent){
        return res.status(400).json({error:"Class name already exsists"});
    }

    newClass._id = new ObjectId().toString();
    classes.push(newClass);
    await readWrite.writeDataFile(classes);

    return res.status(200).json(newClass._id);
}catch(err){
    console.error("failed to post class", err);
    return res.status(500).json({error: err});
}
}


async function handleUpdateClass(req :express.Request, res :express.Response) {
    const classId :string = req.params.classId;
    const updatedClass :IClass = req.body;
    var classes :IClass[] = await readWrite.readDataFile();
    if (!ObjectId.isValid(new ObjectId(classId))) {
        return res.status(400).json({ error: "Class not found" });
    }

    // Validation
    if (!updatedClass.name || !updatedClass.startDate || !updatedClass.endDate || !updatedClass.startTime || !updatedClass.duration || updatedClass.capacity === 0) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (updatedClass.capacity < 1) {
        return res.status(400).json({ error: "Capacity must be at least 1" });
    }
    try{
    const start = new Date(updatedClass.startDate);
    const end = new Date(updatedClass.endDate);
    const now = new Date();

    if (end < now || start > end) {
        return res.status(400).json({ error: "End date must be in the future" });
    }

    const index = classes.findIndex(cls => cls._id === updatedClass._id);

    if (index !== -1) {
        classes[index] = updatedClass;
    }
    await readWrite.writeDataFile(classes);

    return res.status(200).json(updatedClass);
}catch(err){
    console.error("failed to update class", err);
    return res.status(500).json({error: err});
}
}

async function handleDeleteClass(req :express.Request, res : express.Response){
    const classId: string = req.params.classId;
    if (!ObjectId.isValid(new ObjectId(classId))) {
        return res.status(400).json({ error: "Class not found" });
    }
    try{
    const classes: IClass[] = await readWrite.readDataFile();
    const indexToRemove = classes.findIndex(c => c._id === classId);

    if (indexToRemove === -1) {
        return res.status(400).json({error: "Class not present"});
    }

    classes.splice(indexToRemove, 1);

    await readWrite.writeDataFile(classes);

    return res.status(200).json(classId);
}catch(err){
    console.error("failed to delete class", err);
    return res.status(500).json({error: err});
}
}

router.get('/classes', handleGetClasses);
router.post('/classes', handleAddClass);
router.put('/classes/:classId', handleUpdateClass);
router.delete('/classes/:classId', handleDeleteClass);

export default router;
