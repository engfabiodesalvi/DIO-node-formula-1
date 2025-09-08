import { FastifyReply, FastifyRequest } from "fastify";
import { LapTimeModel } from "../../models/data/lap-time-model";
import { isLapTimeModel } from "../../utils/isType/lap-time-model/is-lapTimeModel-type";
import { listLapTimes, loadLapTimesJsonFile, pathLapTimesDataJson, saveExtLapTimesToJsonFile, sortListLapTimes } from "./load-lap-times-standings-repository";


// PUT - (Upsert) Edit or inser new lap time
export const repositoryUpsertLapTime = async (
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
                // check for upsertLapTime key in data body
                let foundKeyUpsertLapTime = false;
                for (const key in reqBody) {
                    if (key === "upsertLapTime")
                        foundKeyUpsertLapTime = true;
                }
                // proceed if the upsertLapTime object was found
                if (foundKeyUpsertLapTime) {
                    // obtain data from upsertLapTime object
                    let upsertLapTime = reqBody['upsertLapTime'] as LapTimeModel; 
                    // check the data format match with LapTimeModel
                    if (await isLapTimeModel(upsertLapTime)) { 

                        // find raceId, driverId and lap in database
                        if (upsertLapTime.raceId > 0 && upsertLapTime.driverId && upsertLapTime.lap) {
                            // checking if the lap is aready registered
                            let itemMatch = false;
                            listLapTimes.forEach(itemLapTime => {
                                if (itemLapTime.raceId === upsertLapTime.raceId &&
                                    itemLapTime.driverId === upsertLapTime.driverId &&
                                    itemLapTime.lap === upsertLapTime.lap) {

                                    // edit lap time properties
                                    itemLapTime.raceId = upsertLapTime.raceId;
                                    itemLapTime.driverId = upsertLapTime.driverId;
                                    itemLapTime.lap = upsertLapTime.lap;
                                    itemLapTime.position = upsertLapTime.position;
                                    itemLapTime.time = upsertLapTime.time;
                                    itemLapTime.milliseconds = upsertLapTime.milliseconds;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if times don't match
                            if (!itemMatch) {
                                listLapTimes.push(upsertLapTime);                
                            }

                            // ascendant order lapTimesId 
                            await sortListLapTimes();
                            // save insert/edit data to json file
                            await saveExtLapTimesToJsonFile(pathLapTimesDataJson, listLapTimes);
                            await loadLapTimesJsonFile(pathLapTimesDataJson);       
                            
                            // find for inserted/edited lap time
                            let foundLapTime = listLapTimes.filter(
                                (itemLapTime)=> {
                                    if (itemLapTime.raceId === upsertLapTime.raceId &&
                                        itemLapTime.driverId === upsertLapTime.driverId &&
                                        itemLapTime.lap === upsertLapTime.lap) {

                                        upsertLapTime = itemLapTime;
                                        console.log('Lap Time found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundLapTime.length === 0) {
                                    console.log("Lap Time wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[raceId: ${upsertLapTime.raceId}] and [raceId: ${upsertLapTime.raceId}] and [lap: ${upsertLapTime.lap}] wasn't inserted!`,
                                        "upsertLapTime": upsertLapTime};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[raceId: ${upsertLapTime.raceId}] and [raceId: ${upsertLapTime.raceId}] and [lap: ${upsertLapTime.lap}] edited/inserted!`,
                                        "upsertLapTime": upsertLapTime};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${upsertLapTime.raceId}] and [raceId: ${upsertLapTime.raceId}] and [lap: ${upsertLapTime.lap}] must be a non-zer positive number!`,
                                "upsertLapTime": upsertLapTime};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send lap time data to be edited/inserted!"}              
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