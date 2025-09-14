import { FastifyReply, FastifyRequest } from "fastify";
import { RaceModel } from "../../models/data/race-model";
import { isRaceModel } from "../../utils/isType/race-model/is-raceModel-type";
import { listRaces, loadRacesJsonFile, pathRacesDataJson, saveExtRacesToJsonFile, sortListRaces } from "./load-races-repository";

// PUT - (Upsert) Edit or inser new race
export const repositoryUpsertRace = async (
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
                // check for upsertRace key in data body
                let foundKeyUpsertRace = false;
                for (const key in reqBody) {
                    if (key === "upsertRace")
                        foundKeyUpsertRace = true;
                }
                // proceed if the upsertRace object was found
                if (foundKeyUpsertRace) {
                    // obtain data from upsertRace object
                    let upsertRace = reqBody['upsertRace'] as RaceModel; 
                    // check the data format match with RaceModel
                    if (await isRaceModel(upsertRace)) { 

                        // find raceId in database
                        if (upsertRace.raceId > 0) {
                            // checking if the race is aready registered
                            let itemMatch = false;
                            listRaces.forEach(itemRace => {
                                if (itemRace.raceId === upsertRace.raceId) {

                                    // edit race properties
                                    itemRace.raceId = upsertRace.raceId;
                                    itemRace.year = upsertRace.year;
                                    itemRace.round = upsertRace.round;
                                    itemRace.circuitId = upsertRace.circuitId;
                                    itemRace.name = upsertRace.name;
                                    itemRace.date = upsertRace.date;
                                    itemRace.time = upsertRace.time;
                                    itemRace.url = upsertRace.url;
                                    itemRace.fp1_date = upsertRace.fp1_date;
                                    itemRace.fp1_time = upsertRace.fp1_time;
                                    itemRace.fp2_date = upsertRace.fp2_date;
                                    itemRace.fp2_time = upsertRace.fp2_time;
                                    itemRace.fp3_date = upsertRace.fp3_date;
                                    itemRace.fp3_time = upsertRace.fp3_time;
                                    itemRace.quali_date = upsertRace.quali_date;
                                    itemRace.quali_time = upsertRace.quali_time;
                                    itemRace.sprint_date = upsertRace.sprint_date;
                                    itemRace.sprint_time = upsertRace.sprint_time;
                                    
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if times don't match
                            if (!itemMatch) {
                                listRaces.push(upsertRace);                
                            }

                            // ascendant order raceId 
                            await sortListRaces();
                            // save insert/edit data to json file
                            await saveExtRacesToJsonFile(pathRacesDataJson, listRaces);
                            await loadRacesJsonFile(pathRacesDataJson);       
                            
                            // find for inserted/edited race
                            let foundRace = listRaces.filter(
                                (itemRace)=> {
                                    if (itemRace.raceId === upsertRace.raceId) {

                                        upsertRace = itemRace;
                                        console.log('Race found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundRace.length === 0) {
                                    console.log("Race wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[raceId: ${upsertRace.raceId}] wasn't inserted!`,
                                        "upsertRace": upsertRace};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {                                    
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[raceId: ${upsertRace.raceId}] edited!`,
                                            "upsertRace": upsertRace};                        
                                    } else {
                                        response.type("application/json").code(201); // Ok
                                        return {
                                            "message": `[raceId: ${upsertRace.raceId}] inserted!`,
                                            "upsertRace": upsertRace};                                           
                                    }
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[raceId: ${upsertRace.raceId}] must be a non-zer positive number!`,
                                "upsertRace": upsertRace};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send race data to be edited/inserted!"}              
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