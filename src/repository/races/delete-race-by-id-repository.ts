import { FastifyReply, FastifyRequest } from "fastify";
import { RaceParams } from "../../models/params/race-params-model";
import { RaceModel } from "../../models/data/race-model";
import { listRaces, loadRacesJsonFile, pathRacesDataJson, saveExtRacesToJsonFile } from "./load-races-repository";

// DELETE - Delete a race
export const repositoryDeleteRaceById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteRaceId from params
            const raceParams = request.params as RaceParams;
            const deleteRaceId = parseInt(raceParams.raceId) || 0;
            let deleteRace:Partial<RaceModel> = {
                raceId: deleteRaceId
            };
            
            console.log(`${deleteRaceId} `);

            // ckeck if deleteRaceId > 0 
            if (deleteRaceId > 0 ) {
                // find raceId in database
                let foundRace = listRaces.filter(
                    (itemRace)=> {
                        if (itemRace.raceId === deleteRaceId) {

                            deleteRace = itemRace;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if race match
                if (foundRace.length > 0) {              
                    
                    const newListRaces = listRaces.filter(
                        (itemRace)=> !(itemRace.raceId === deleteRace.raceId));
                                                    
                    // save new data to json file
                    await saveExtRacesToJsonFile(pathRacesDataJson, newListRaces);
                    await loadRacesJsonFile(pathRacesDataJson);

                    foundRace = listRaces.filter(
                        (itemRace)=> {
                        if (itemRace.raceId === deleteRaceId) {
                                console.log('Race found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundRace.length === 0) {
                        console.log("Race deleted");
                        response.type("application/json").code(200); // not content                                    
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
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[raceId: ${deleteRace.raceId}] wasn't found!`,
                        "deleteRace": deleteRace};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[raceId: ${deleteRace.raceId}] must be a non-zero positive number!`};                
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


