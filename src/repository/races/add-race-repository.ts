import { FastifyReply, FastifyRequest } from "fastify";
import { RaceModel } from "../../models/data/race-model";
import { isRaceModel } from "../../utils/isType/race-model/is-raceModel-type";
import { listRaces, loadRacesJsonFile, pathRacesDataJson, saveExtRacesToJsonFile, sortListRaces } from "./load-races-repository";

// POST - Create/insert new race
export const repositoryNewRace = async (
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
                // check for newRace key in data body
                let foundKeyNewRace = false;
                for (const key in reqBody) {
                    if (key === "newRace")
                        foundKeyNewRace = true;            
                }
                // proceed if the newRace object was found
                if (foundKeyNewRace) {
                    // obtain data from newRace object
                    let newRace = reqBody['newRace'] as RaceModel; 
                    // check the data format match with RaceModel
                    if (await isRaceModel(newRace)) { 

                        // checking if raceId > 0
                        if (newRace.raceId > 0) {

                            // find new race raceId in database
                            let findRace = listRaces.filter(
                                (itemRace) => itemRace.raceId === newRace.raceId);
                                

                            // insert new item if no stops match
                            if (findRace.length === 0) {              
                                listRaces.push(newRace);

                                // ascendant order races 
                                await sortListRaces();
                                // save new data to json file
                                await saveExtRacesToJsonFile(pathRacesDataJson, listRaces);
                                await loadRacesJsonFile(pathRacesDataJson);      
                                            
                                //listRaces = listRaces.sort((a, b) => a.raceId - b.raceId);
                                // verify if new item was inserted
                                findRace = listRaces.filter(
                                    (itemRace)=> {
                                        if (itemRace.raceId === newRace.raceId) {

                                            newRace = itemRace;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findRace.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[raceId: ${newRace.raceId}] inserted!`, 
                                        "newRace": findRace};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[raceId: ${newRace.raceId}] wasn't inserted!`,
                                        "newRace": newRace};
                                }
                            } else {
                                // race alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[raceId: ${newRace.raceId}] already created!`,
                                    "newRace": newRace};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${newRace.raceId}] must be a positive number!`,
                                "newRace": newRace};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send race data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newRace};
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
