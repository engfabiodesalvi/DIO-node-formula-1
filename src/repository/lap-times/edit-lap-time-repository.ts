import { FastifyReply, FastifyRequest } from "fastify";
import { LapTimeModel } from "../../models/data/lap-time-model";
import { isPartialLapTimeModel } from "../../utils/isType/lap-time-model/is-partial-lapTimeModel-type";
import { listLapTimes, loadLapTimesJsonFile, pathLapTimesDataJson, saveExtLapTimesToJsonFile, sortListLapTimes } from "./load-lap-times-repository";

// PATCH - Edit a lap time
export const repositoryEditLapTime = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {
            
            // ckeck if reqBody is defined
            if (reqBody) {            
                // check for editLapTime key in data body
                let foundKeyEditLapTime = false;
                for (const key in reqBody) {
                    if (key === "editLapTime")
                        foundKeyEditLapTime = true;
                }
                // proceed if the editLapTime object was found
                if (foundKeyEditLapTime) {
                    // obtain data from editLapTime object
                    let editLapTime = reqBody['editLapTime'] as LapTimeModel; 
                    console.log(editLapTime);
                    // check the data format partially match with LapTimeModel
                    if (await isPartialLapTimeModel(editLapTime)) { 

                        // find lapTimeId raceId, driveId and lap in database
                        if (editLapTime.raceId > 0 && editLapTime.driverId > 0 && editLapTime.lap > 0) {
                            // checking if the lap time is aready registered
                            let itemMatch = false;
                            listLapTimes.forEach(itemLapTime => {
                                if (itemLapTime.raceId === editLapTime.raceId &&
                                    itemLapTime.driverId === editLapTime.driverId &&
                                    itemLapTime.lap === editLapTime.lap) {
                                        // edit partially lap time properties
                                        for (let key in editLapTime) {
                                            itemLapTime[key as keyof object] = editLapTime[key as keyof object];
                                        }
                                        itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if times don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Lap Time Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListLapTimes();
                            // save insert/edit data to json file
                            await saveExtLapTimesToJsonFile(pathLapTimesDataJson, listLapTimes);
                            await loadLapTimesJsonFile(pathLapTimesDataJson);       
                            
                            // find for inserted/edited lap time
                            let foundLapTime = listLapTimes.filter(
                                (itemLapTime)=> {
                                if (itemLapTime.raceId === editLapTime.raceId &&
                                    itemLapTime.driverId === editLapTime.driverId &&
                                    itemLapTime.lap === editLapTime.lap) {
                                        console.log('Lap Time found!');
                                        // load all data
                                        editLapTime = itemLapTime;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundLapTime.length === 0) {
                                    console.log("LapTime wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[raceId: ${editLapTime.raceId}] and [driveId: ${editLapTime.driverId}] and [lap: ${editLapTime.lap}] wasn't edited!`,
                                        "editLapTime": editLapTime};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[raceId: ${editLapTime.raceId}] and [driveId: ${editLapTime.driverId}] and [lap: ${editLapTime.lap}] edited!`,
                                        "editLapTime": editLapTime};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${editLapTime.raceId}] and [driveId: ${editLapTime.driverId}] and [lap: ${editLapTime.lap}] must be a positive number!`,
                                "editLapTime": editLapTime};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send lap time data to be edited!"}              
                }

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                
            
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }  

}
