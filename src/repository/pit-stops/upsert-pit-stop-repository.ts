import { FastifyReply, FastifyRequest } from "fastify";
import { PitStopModel } from "../../models/data/pit-stop-model";
import { isPitStopModel } from "../../utils/isType/pit-stop-model/is-pitStopModel-type";
import { listPitStops, loadPitStopsJsonFile, pathPitStopsDataJson, saveExtPitStopsToJsonFile, sortListPitStops } from "./load-pit-stops-repository";

// PUT - (Upsert) Edit or inser new pit stop
export const repositoryUpsertPitStop = async (
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
                // check for upsertPitStop key in data body
                let foundKeyUpsertPitStop = false;
                for (const key in reqBody) {
                    if (key === "upsertPitStop")
                        foundKeyUpsertPitStop = true;
                }
                // proceed if the upsertPitStop object was found
                if (foundKeyUpsertPitStop) {
                    // obtain data from upsertPitStop object
                    let upsertPitStop = reqBody['upsertPitStop'] as PitStopModel; 
                    // check the data format match with PitStopModel
                    if (await isPitStopModel(upsertPitStop)) { 

                        // find raceId, driverId and lap in database
                        if (upsertPitStop.raceId > 0 && upsertPitStop.driverId > 0 && upsertPitStop.lap > 0) {
                            // checking if the lap is aready registered
                            let itemMatch = false;
                            listPitStops.forEach(itemPitStop => {
                                if (itemPitStop.raceId === upsertPitStop.raceId &&
                                    itemPitStop.driverId === upsertPitStop.driverId &&
                                    itemPitStop.lap === upsertPitStop.lap) {

                                    // edit pit stop properties
                                    itemPitStop.stop = upsertPitStop.stop;
                                    itemPitStop.duration = upsertPitStop.duration;
                                    itemPitStop.time = upsertPitStop.time;
                                    itemPitStop.milliseconds = upsertPitStop.milliseconds;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if times don't match
                            if (!itemMatch) {
                                listPitStops.push(upsertPitStop);                
                            }

                            // ascendant order lapStopsId 
                            await sortListPitStops();
                            // save insert/edit data to json file
                            await saveExtPitStopsToJsonFile(pathPitStopsDataJson, listPitStops);
                            await loadPitStopsJsonFile(pathPitStopsDataJson);       
                            
                            // find for inserted/edited pit stop
                            let foundPitStop = listPitStops.filter(
                                (itemPitStop)=> {
                                    if (itemPitStop.raceId === upsertPitStop.raceId &&
                                        itemPitStop.driverId === upsertPitStop.driverId &&
                                        itemPitStop.lap === upsertPitStop.lap) {

                                        upsertPitStop = itemPitStop;
                                        console.log('Pit Stop found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundPitStop.length === 0) {
                                    console.log("Pit Stop wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[raceId: ${upsertPitStop.raceId}] and [driveId: ${upsertPitStop.driverId}] and [lap: ${upsertPitStop.lap}] wasn't inserted!`,
                                        "upsertPitStop": upsertPitStop};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {                                    
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[raceId: ${upsertPitStop.raceId}] and [driveId: ${upsertPitStop.driverId}] and [lap: ${upsertPitStop.lap}] edited!`,
                                            "upsertPitStop": upsertPitStop};
                                    } else {
                                        response.type("application/json").code(201); // Create
                                        return {
                                            "message": `[raceId: ${upsertPitStop.raceId}] and [driveId: ${upsertPitStop.driverId}] and [lap: ${upsertPitStop.lap}] inserted!`,
                                            "upsertPitStop": upsertPitStop};                                        
                                    }                 
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${upsertPitStop.raceId}] and [driveId: ${upsertPitStop.driverId}] and [lap: ${upsertPitStop.lap}] must be a non-zer positive number!`,
                                "upsertPitStop": upsertPitStop};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send pit stop data to be edited/inserted!"}              
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