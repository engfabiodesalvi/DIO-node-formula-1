import { FastifyReply, FastifyRequest } from "fastify";
import { RaceModel } from "../../models/data/race-model";
import { isPartialRaceModel } from "../../utils/isType/race-model/is-partial-raceModel-type";
import { listRaces, loadRacesJsonFile, pathRacesDataJson, saveExtRacesToJsonFile } from "./load-races-repository";

// DELETE - Delete a race
export const repositoryDeleteRace = async (
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

                // check for deleteRace key in data body
                let foundKeyRace = false;
                for (const key in reqBody) {
                    if (key === "deleteRace")
                        foundKeyRace = true;
                }
                // proceed if the deleteRace object was found
                if (foundKeyRace) {
                    // obtain data from deleteRace object
                    let deleteRace = reqBody['deleteRace'] as RaceModel; 
                    // check the data format match parcially with RaceModel
                    if (await isPartialRaceModel(deleteRace)) {
                        
                        // find raceId
                        if (deleteRace.raceId > 0) {
                            let foundRace = listRaces.filter(
                                (itemRace)=> {
                                    if (itemRace.raceId === deleteRace.raceId) {

                                        deleteRace = itemRace;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if stops match
                            if (foundRace.length > 0) {              
                                
                                const newListRaces = listRaces.filter(
                                    (itemRace)=> !(itemRace.raceId === deleteRace.raceId));
                                                                
                                // save new data to json file
                                await saveExtRacesToJsonFile(pathRacesDataJson, newListRaces);
                                await loadRacesJsonFile(pathRacesDataJson);

                                // find for deleted race
                                foundRace = listRaces.filter(
                                    (itemRace)=> {
                                        if (itemRace.raceId === deleteRace.raceId) {

                                            console.log('Race found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundRace.length === 0) {
                                    console.log("Race deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[raceId: ${deleteRace.raceId}] deleted!`,
                                        "deleteRace": deleteRace};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[raceId: ${deleteRace.raceId}] wasn't deleted!`,
                                        "deleteRace": deleteRace};                        
                                }
                            } else {
                                // race alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[raceId: ${deleteRace.raceId}] wasn't found!`,
                                    "deleteRace": deleteRace};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${deleteRace.raceId}] must be a non-zero positive number!`,
                                "deleteRace": deleteRace};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send raceId to be deleted!"}              
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
