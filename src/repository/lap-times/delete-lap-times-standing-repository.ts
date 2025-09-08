import { FastifyReply, FastifyRequest } from "fastify";
import { LapTimeModel } from "../../models/data/lap-time-model";
import { isPartialLapTimeModel } from "../../utils/isType/lap-time-model/is-partial-lapTimeModel-type";
import { listLapTimes, loadLapTimesJsonFile, pathLapTimesDataJson, saveExtLapTimesToJsonFile } from "./load-lap-times-standings-repository";


// DELETE - Delete a lap time
export const repositoryDeleteLapTime = async (
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

                // check for deleteLapTime key in data body
                let foundKeyLapTime = false;
                for (const key in reqBody) {
                    if (key === "deleteLapTime")
                        foundKeyLapTime = true;
                }
                // proceed if the deleteLapTime object was found
                if (foundKeyLapTime) {
                    // obtain data from deleteLapTime object
                    let deleteLapTime = reqBody['deleteLapTime'] as LapTimeModel; 
                    // check the data format match parcially with LapTimeModel
                    if (await isPartialLapTimeModel(deleteLapTime)) {
                        
                        // find raceId, driverId and lap in database
                        if (deleteLapTime.raceId > 0 && deleteLapTime.driverId > 0 && deleteLapTime.lap) {
                            let foundLapTime = listLapTimes.filter(
                                (itemLapTime)=> {
                                    if (itemLapTime.raceId === deleteLapTime.raceId &&
                                        itemLapTime.driverId === deleteLapTime.driverId &&
                                        itemLapTime.lap === deleteLapTime.lap ) {

                                        deleteLapTime = itemLapTime;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if times match
                            if (foundLapTime.length > 0) {              
                                
                                const newListLapTimes = listLapTimes.filter(
                                    (itemLapTime)=> !(itemLapTime.raceId === deleteLapTime.raceId && 
                                                    itemLapTime.driverId === deleteLapTime.driverId &&
                                                    itemLapTime.lap === deleteLapTime.lap));
                                                                
                                // save new data to json file
                                await saveExtLapTimesToJsonFile(pathLapTimesDataJson, newListLapTimes);
                                await loadLapTimesJsonFile(pathLapTimesDataJson);

                                // find for deleted lap time
                                foundLapTime = listLapTimes.filter(
                                    (itemLapTime)=> {
                                        if (itemLapTime.raceId === deleteLapTime.raceId &&
                                            itemLapTime.driverId === deleteLapTime.driverId &&
                                            itemLapTime.lap === deleteLapTime.lap) {

                                            console.log('Lap Time found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundLapTime.length === 0) {
                                    console.log("Lap Time deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}]  deleted!`,
                                        "deleteLapTime": deleteLapTime};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}]  wasn't deleted!`,
                                        "deleteLapTime": deleteLapTime};                        
                                }
                            } else {
                                // lap time alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}]  wasn't found!`,
                                    "deleteLapTime": deleteLapTime};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}]  must be a non-zero positive number!`,
                                "deleteLapTime": deleteLapTime};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send raceId, driverId and lap to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newLap};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
