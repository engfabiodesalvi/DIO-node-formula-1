import { FastifyReply, FastifyRequest } from "fastify";
import { PitStopModel } from "../../models/data/pit-stop-model";
import { isPartialPitStopModel } from "../../utils/isType/pit-stop-model/is-partial-pitStopModel-type";
import { listPitStops, loadPitStopsJsonFile, pathPitStopsDataJson, saveExtPitStopsToJsonFile } from "./load-pit-stops-repository";

// DELETE - Delete a pit stop
export const repositoryDeletePitStop = async (
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

                // check for deletePitStop key in data body
                let foundKeyPitStop = false;
                for (const key in reqBody) {
                    if (key === "deletePitStop")
                        foundKeyPitStop = true;
                }
                // proceed if the deletePitStop object was found
                if (foundKeyPitStop) {
                    // obtain data from deletePitStop object
                    let deletePitStop = reqBody['deletePitStop'] as PitStopModel; 
                    // check the data format match parcially with PitStopModel
                    if (await isPartialPitStopModel(deletePitStop)) {
                        
                        // find raceId, driverId and pit in database
                        if (deletePitStop.raceId > 0 && deletePitStop.driverId > 0 && deletePitStop.lap > 0) {
                            let foundPitStop = listPitStops.filter(
                                (itemPitStop)=> {
                                    if (itemPitStop.raceId === deletePitStop.raceId &&
                                        itemPitStop.driverId === deletePitStop.driverId &&
                                        itemPitStop.lap === deletePitStop.lap ) {

                                        deletePitStop = itemPitStop;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if stops match
                            if (foundPitStop.length > 0) {              
                                
                                const newListPitStops = listPitStops.filter(
                                    (itemPitStop)=> !(itemPitStop.raceId === deletePitStop.raceId && 
                                                    itemPitStop.driverId === deletePitStop.driverId &&
                                                    itemPitStop.lap === deletePitStop.lap));
                                                                
                                // save new data to json file
                                await saveExtPitStopsToJsonFile(pathPitStopsDataJson, newListPitStops);
                                await loadPitStopsJsonFile(pathPitStopsDataJson);

                                // find for deleted pit stop
                                foundPitStop = listPitStops.filter(
                                    (itemPitStop)=> {
                                        if (itemPitStop.raceId === deletePitStop.raceId &&
                                            itemPitStop.driverId === deletePitStop.driverId &&
                                            itemPitStop.lap === deletePitStop.lap) {

                                            console.log('Pit Stop found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundPitStop.length === 0) {
                                    console.log("Pit Stop deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [lap: ${deletePitStop.lap}]  deleted!`,
                                        "deletePitStop": deletePitStop};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [lap: ${deletePitStop.lap}]  wasn't deleted!`,
                                        "deletePitStop": deletePitStop};                        
                                }
                            } else {
                                // pit stop alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [lap: ${deletePitStop.lap}]  wasn't found!`,
                                    "deletePitStop": deletePitStop};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${deletePitStop.raceId}] and [driverId: ${deletePitStop.driverId}] and [lap: ${deletePitStop.lap}]  must be a non-zero positive number!`,
                                "deletePitStop": deletePitStop};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send raceId, driverId and pit to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newPit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
