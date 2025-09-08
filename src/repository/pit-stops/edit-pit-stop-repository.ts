import { FastifyReply, FastifyRequest } from "fastify";
import { PitStopModel } from "../../models/data/pit-stop-model";
import { isPartialPitStopModel } from "../../utils/isType/pit-stop-model/is-partial-pitStopModel-type";
import { listPitStops, loadPitStopsJsonFile, pathPitStopsDataJson, saveExtPitStopsToJsonFile, sortListPitStops } from "./load-pit-stops-repository";

// PATCH - Edit a pit stop
export const repositoryEditPitStop = async (
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
                // check for editPitStop key in data body
                let foundKeyEditPitStop = false;
                for (const key in reqBody) {
                    if (key === "editPitStop")
                        foundKeyEditPitStop = true;
                }
                // proceed if the editPitStop object was found
                if (foundKeyEditPitStop) {
                    // obtain data from editPitStop object
                    let editPitStop = reqBody['editPitStop'] as PitStopModel; 
                    console.log(editPitStop);
                    // check the data format partially match with PitStopModel
                    if (await isPartialPitStopModel(editPitStop)) { 

                        // find pitStopId raceId, driveId and pit in database
                        if (editPitStop.raceId > 0 && editPitStop.driverId > 0 && editPitStop.lap > 0) {
                            // checking if the pit stop is aready registered
                            let itemMatch = false;
                            listPitStops.forEach(itemPitStop => {
                                if (itemPitStop.raceId === editPitStop.raceId &&
                                    itemPitStop.driverId === editPitStop.driverId &&
                                    itemPitStop.lap === editPitStop.lap) {
                                        // edit partially pit stop properties
                                        for (let key in editPitStop) {
                                            itemPitStop[key as keyof object] = editPitStop[key as keyof object];
                                        }
                                        itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if stops don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Pit Stop Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListPitStops();
                            // save insert/edit data to json file
                            await saveExtPitStopsToJsonFile(pathPitStopsDataJson, listPitStops);
                            await loadPitStopsJsonFile(pathPitStopsDataJson);       
                            
                            // find for inserted/edited pit stop
                            let foundPitStop = listPitStops.filter(
                                (itemPitStop)=> {
                                if (itemPitStop.raceId === editPitStop.raceId &&
                                    itemPitStop.driverId === editPitStop.driverId &&
                                    itemPitStop.lap === editPitStop.lap) {
                                        console.log('Pit Stop found!');
                                        // load all data
                                        editPitStop = itemPitStop;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundPitStop.length === 0) {
                                    console.log("PitStop wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[raceId: ${editPitStop.raceId}] and [driveId: ${editPitStop.driverId}] and [lap: ${editPitStop.lap}] wasn't edited!`,
                                        "editPitStop": editPitStop};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[raceId: ${editPitStop.raceId}] and [driveId: ${editPitStop.driverId}] and [lap: ${editPitStop.lap}] edited!`,
                                        "upsertPitStop": editPitStop};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${editPitStop.raceId}] and [driveId: ${editPitStop.driverId}] and [lap: ${editPitStop.lap}] must be a positive number!`,
                                "editPitStop": editPitStop};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send pit stop data to be edited!"}              
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
