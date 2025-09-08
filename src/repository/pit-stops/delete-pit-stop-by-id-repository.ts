import { FastifyReply, FastifyRequest } from "fastify";
import { PitStopParams } from "../../models/params/pit-stop-params-model";
import { PitStopModel } from "../../models/data/pit-stop-model";
import { listPitStops, loadPitStopsJsonFile, pathPitStopsDataJson, saveExtPitStopsToJsonFile } from "./load-pit-stops-repository";

// DELETE - Delete a pit stop
export const repositoryDeletePitStopById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deletePitId from params
            const pitStopParams = request.params as PitStopParams;
            const deleteRaceId = parseInt(pitStopParams.raceId) || 0;
            const deleteDriveId = parseInt(pitStopParams.driverId) || 0;
            const deleteLap = parseInt(pitStopParams.lap) || 0;
            let deletePitStop:Partial<PitStopModel> = {
                raceId: deleteRaceId,
                driverId: deleteDriveId,
                lap: deleteLap
            };
            
            console.log(`${deleteRaceId} - ${deleteDriveId} - ${deleteLap} `);

            // ckeck if deleteRaceId > 0 and deleteDriverId > 0 and deleteLap > 0
            if (deleteRaceId > 0 && deleteDriveId > 0 && deleteLap > 0) {
                // find raceId in database
                let foundPitStop = listPitStops.filter(
                    (itemPitStop)=> {
                        if (itemPitStop.raceId === deleteRaceId &&
                            itemPitStop.driverId === deleteDriveId &&
                            itemPitStop.lap === deleteLap) {

                            deletePitStop = itemPitStop;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if pitStop match
                if (foundPitStop.length > 0) {              
                    
                    const newListPitStops = listPitStops.filter(
                        (itemPitStop)=> !(itemPitStop.raceId === deletePitStop.raceId && 
                                        itemPitStop.driverId === deletePitStop.driverId &&
                                        itemPitStop.lap === deletePitStop.lap));
                                                    
                    // save new data to json file
                    await saveExtPitStopsToJsonFile(pathPitStopsDataJson, newListPitStops);
                    await loadPitStopsJsonFile(pathPitStopsDataJson);

                    foundPitStop = listPitStops.filter(
                        (itemPitStop)=> {
                        if (itemPitStop.raceId === deleteRaceId &&
                            itemPitStop.driverId === deleteDriveId &&
                            itemPitStop.lap === deleteLap) {
                                console.log('Pit Stop found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundPitStop.length === 0) {
                        console.log("Pit Stop deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [pit: ${deletePitStop.lap}] deleted!`,
                            "deletePitStop": deletePitStop};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [pit: ${deletePitStop.lap}] wasn't deleted!`,
                            "deletePitStop": deletePitStop};                        
                    }
                } else {
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [pit: ${deletePitStop.lap}] wasn't found!`,
                        "deletePitStop": deletePitStop};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [pit: ${deletePitStop.lap}] must be a non-zero positive number!`};                
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


