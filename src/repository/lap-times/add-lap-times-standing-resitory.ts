import { FastifyReply, FastifyRequest } from "fastify";
import { LapTimeModel } from "../../models/data/lap-time-model";
import { isLapTimeModel } from "../../utils/isType/lap-time-model/is-lapTimeModel-type";
import { listLapTimes, loadLapTimesJsonFile, pathLapTimesDataJson, saveExtLapTimesToJsonFile, sortListLapTimes } from "./load-lap-times-standings-repository";


// POST - Create/insert new lap time
export const repositoryNewLapTime = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // ckeck if reqBody is defined
            if (reqBody) {            
                // check for newLapTime key in data body
                let foundKeyNewLapTime = false;
                for (const key in reqBody) {
                    if (key === "newLapTime")
                        foundKeyNewLapTime = true;            
                }
                // proceed if the newLapTime object was found
                if (foundKeyNewLapTime) {
                    // obtain data from newLapTime object
                    let newLapTime = reqBody['newLapTime'] as LapTimeModel; 
                    // check the data format match with LapTimeModel
                    if (await isLapTimeModel(newLapTime)) { 

                        // checking if raceId > 0
                        if (newLapTime.raceId > 0) {

                            // find new lap time raceId, driveId and lab in database
                            let findLapTime = listLapTimes.filter(
                                (itemLapTime) => itemLapTime.raceId === newLapTime.raceId &&
                                                itemLapTime.driverId === newLapTime.driverId &&
                                                itemLapTime.lap === newLapTime.lap);
                                

                            // insert new item if no times match
                            if (findLapTime.length === 0) {              
                                listLapTimes.push(newLapTime);

                                // ascendant order lap times 
                                await sortListLapTimes();
                                // save new data to json file
                                await saveExtLapTimesToJsonFile(pathLapTimesDataJson, listLapTimes);
                                await loadLapTimesJsonFile(pathLapTimesDataJson);      
                                            
                                //listLapTimes = listLapTimes.sort((a, b) => a.raceId - b.raceId);
                                // verify if new item was inserted
                                findLapTime = listLapTimes.filter(
                                    (itemLapTime)=> {
                                        if (itemLapTime.raceId === newLapTime.raceId &&
                                            itemLapTime.driverId === newLapTime.driverId &&
                                            itemLapTime.lap === newLapTime.lap) {

                                            newLapTime = itemLapTime;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findLapTime.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[raceId: ${newLapTime.raceId}] and [driveId: ${newLapTime.driverId}] and [lap: ${newLapTime.lap}] inserted!`, 
                                        "newLapTime": findLapTime};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[raceId: ${newLapTime.raceId}] and [driveId: ${newLapTime.driverId}] and [lap: ${newLapTime.lap}] wasn't inserted!`,
                                        "newLapTime": newLapTime};
                                }
                            } else {
                                // lap time alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[raceId: ${newLapTime.raceId}] and [driveId: ${newLapTime.driverId}] and [lap: ${newLapTime.lap}] already created!`,
                                    "newLapTime": newLapTime};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${newLapTime.raceId}] and [driveId: ${newLapTime.driverId}] and [lap: ${newLapTime.lap}] must be a positive number!`,
                                "newLapTime": newLapTime};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send lap time data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newLapTime};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }


    //return request.headers.authorization;
}
