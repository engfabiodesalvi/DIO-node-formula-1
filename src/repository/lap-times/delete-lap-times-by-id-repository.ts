import { FastifyReply, FastifyRequest } from "fastify";
import { LapTimeParams } from "../../models/params/lap-time-params-model";
import { LapTimeModel } from "../../models/data/lap-time-model";
import { listLapTimes, loadLapTimesJsonFile, pathLapTimesDataJson, saveExtLapTimesToJsonFile } from "./load-lap-times-repository";

// DELETE - Delete a lap time
export const repositoryDeleteLapTimeById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteLapId from params
            const lapTimeParams = request.params as LapTimeParams;
            const deleteRaceId = parseInt(lapTimeParams.raceId) || 0;
            const deleteDriveId = parseInt(lapTimeParams.driverId) || 0;
            const deleteLap = parseInt(lapTimeParams.lap) || 0;
            let deleteLapTime:Partial<LapTimeModel> = {
                raceId: deleteRaceId,
                driverId: deleteDriveId,
                lap: deleteLap
            };
            
            console.log(`${deleteRaceId} - ${deleteDriveId} - ${deleteLap} `);

            // ckeck if deleteRaceId > 0 and deleteDriverId > 0 and deleteLap > 0
            if (deleteRaceId > 0 && deleteDriveId > 0 && deleteLap > 0) {
                // find raceId in database
                let foundLapTime = listLapTimes.filter(
                    (itemLapTime)=> {
                        if (itemLapTime.raceId === deleteRaceId &&
                            itemLapTime.driverId === deleteDriveId &&
                            itemLapTime.lap === deleteLap) {

                            deleteLapTime = itemLapTime;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if lapTime match
                if (foundLapTime.length > 0) {              
                    
                    const newListLapTimes = listLapTimes.filter(
                        (itemLapTime)=> !(itemLapTime.raceId === deleteLapTime.raceId && 
                                        itemLapTime.driverId === deleteLapTime.driverId &&
                                        itemLapTime.lap === deleteLapTime.lap));
                                                    
                    // save new data to json file
                    await saveExtLapTimesToJsonFile(pathLapTimesDataJson, newListLapTimes);
                    await loadLapTimesJsonFile(pathLapTimesDataJson);

                    foundLapTime = listLapTimes.filter(
                        (itemLapTime)=> {
                        if (itemLapTime.raceId === deleteRaceId &&
                            itemLapTime.driverId === deleteDriveId &&
                            itemLapTime.lap === deleteLap) {
                                console.log('Lap Time found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundLapTime.length === 0) {
                        console.log("Lap Time deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}] deleted!`,
                            "deleteLapTime": deleteLapTime};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}] wasn't deleted!`,
                            "deleteLapTime": deleteLapTime};                        
                    }
                } else {
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}] wasn't found!`,
                        "deleteLapTime": deleteLapTime};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[raceId: ${deleteLapTime.raceId}] and [driverId: ${deleteLapTime.driverId}] and [lap: ${deleteLapTime.lap}] must be a non-zero positive number!`};                
            }

        //return {"message": "Bearer Token ok!", newCircuit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}


