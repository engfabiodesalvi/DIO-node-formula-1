import { FastifyReply, FastifyRequest } from "fastify";
import { RaceModel } from "../../models/data/race-model";
import { isPartialRaceModel } from "../../utils/isType/race-model/is-partial-raceModel-type";
import { listRaces, loadRacesJsonFile, pathRacesDataJson, saveExtRacesToJsonFile, sortListRaces } from "./load-races-repository";

// PATCH - Edit a race
export const repositoryEditRace = async (
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
                // check for editRace key in data body
                let foundKeyRace = false;
                for (const key in reqBody) {
                    if (key === "editRace")
                        foundKeyRace = true;
                }
                // proceed if the editRace object was found
                if (foundKeyRace) {
                    // obtain data from editRace object
                    let editRace = reqBody['editRace'] as RaceModel; 
                    console.log(editRace);
                    // check the data format partially match with RaceModel
                    if (await isPartialRaceModel(editRace)) { 

                        // find pitStopId raceId database
                        if (editRace.raceId > 0) {
                            // checking if the race is aready registered
                            let itemMatch = false;
                            listRaces.forEach((itemRace) => {
                                if (itemRace.raceId === editRace.raceId) {
                                        // edit partially race properties
                                        for (let key in editRace) {
                                            itemRace[key as keyof object] = editRace[key as keyof object];
                                        }
                                        itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if stops don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Race Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListRaces();
                            // save insert/edit data to json file
                            await saveExtRacesToJsonFile(pathRacesDataJson, listRaces);
                            await loadRacesJsonFile(pathRacesDataJson);       
                            
                            // find for inserted/edited race
                            let foundRace = listRaces.filter(
                                (itemRace)=> {
                                if (itemRace.raceId === editRace.raceId) {
                                        console.log('Race found!');
                                        // load all data
                                        editRace = itemRace;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundRace.length === 0) {
                                    console.log("Race wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[raceId: ${editRace.raceId}] wasn't edited!`,
                                        "editRace": editRace};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[raceId: ${editRace.raceId}] edited!`,
                                        "editRace": editRace};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${editRace.raceId}] must be a positive number!`,
                                "editRace": editRace};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send race data to be edited!"}              
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
