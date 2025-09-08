import { FastifyReply, FastifyRequest } from "fastify";
import { PitStopModel } from "../../models/data/pit-stop-model";
import { isPitStopModel } from "../../utils/isType/pit-stop-model/is-pitStopModel-type";
import { listPitStops, loadPitStopsJsonFile, pathPitStopsDataJson, saveExtPitStopsToJsonFile, sortListPitStops } from "./load-pit-stops-repository";

// POST - Create/insert new pit stop
export const repositoryNewPitStop = async (
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
                // check for newPitStop key in data body
                let foundKeyNewPitStop = false;
                for (const key in reqBody) {
                    if (key === "newPitStop")
                        foundKeyNewPitStop = true;            
                }
                // proceed if the newPitStop object was found
                if (foundKeyNewPitStop) {
                    // obtain data from newPitStop object
                    let newPitStop = reqBody['newPitStop'] as PitStopModel; 
                    // check the data format match with PitStopModel
                    if (await isPitStopModel(newPitStop)) { 

                        // checking if raceId > 0
                        if (newPitStop.raceId > 0) {

                            // find new pit stop raceId, driveId and lab in database
                            let findPitStop = listPitStops.filter(
                                (itemPitStop) => itemPitStop.raceId === newPitStop.raceId &&
                                                itemPitStop.driverId === newPitStop.driverId &&
                                                itemPitStop.lap === newPitStop.lap);
                                

                            // insert new item if no stops match
                            if (findPitStop.length === 0) {              
                                listPitStops.push(newPitStop);

                                // ascendant order pit stops 
                                await sortListPitStops();
                                // save new data to json file
                                await saveExtPitStopsToJsonFile(pathPitStopsDataJson, listPitStops);
                                await loadPitStopsJsonFile(pathPitStopsDataJson);      
                                            
                                //listPitStops = listPitStops.sort((a, b) => a.raceId - b.raceId);
                                // verify if new item was inserted
                                findPitStop = listPitStops.filter(
                                    (itemPitStop)=> {
                                        if (itemPitStop.raceId === newPitStop.raceId &&
                                            itemPitStop.driverId === newPitStop.driverId &&
                                            itemPitStop.lap === newPitStop.lap) {

                                            newPitStop = itemPitStop;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findPitStop.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[raceId: ${newPitStop.raceId}] and [driveId: ${newPitStop.driverId}] and [lap: ${newPitStop.lap}] inserted!`, 
                                        "newPitStop": findPitStop};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[raceId: ${newPitStop.raceId}] and [driveId: ${newPitStop.driverId}] and [lap: ${newPitStop.lap}] wasn't inserted!`,
                                        "newPitStop": newPitStop};
                                }
                            } else {
                                // pit stop alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[raceId: ${newPitStop.raceId}] and [driveId: ${newPitStop.driverId}] and [lap: ${newPitStop.lap}] already created!`,
                                    "newPitStop": newPitStop};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${newPitStop.raceId}] and [driveId: ${newPitStop.driverId}] and [lap: ${newPitStop.lap}] must be a positive number!`,
                                "newPitStop": newPitStop};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send pit stop data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newPitStop};
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
