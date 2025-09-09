
import { FastifyReply, FastifyRequest } from "fastify";
import { SeasonModel } from "../../models/data/season-model";
import { isSeasonModel } from "../../utils/isType/season-model/is-seasonModel-type";
import { listSeasons, loadSeasonsJsonFile, pathSeasonsDataJson, saveExtSeasonsToJsonFile, sortListSeasons } from "./load-seasons-repository";

// POST - Create/insert new season
export const repositoryNewSeason = async (
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
                // check for newSeason key in data body
                let foundKeyNewSeason = false;
                for (const key in reqBody) {
                    if (key === "newSeason")
                        foundKeyNewSeason = true;            
                }
                // proceed if the newSeason object was found
                if (foundKeyNewSeason) {
                    // obtain data from newSeason object
                    let newSeason = reqBody['newSeason'] as SeasonModel; 
                    // check the data format match with SeasonModel
                    if (await isSeasonModel(newSeason)) { 

                        // checking if year > 0                                                
                        if (newSeason.year > 0) {

                            // find new season id in database
                            let findSeason = listSeasons.filter(
                                (itemSeason)=> itemSeason.year === newSeason.year);

                            // insert new item if no results match
                            if (findSeason.length === 0) {              
                                listSeasons.push(newSeason);

                                // ascendant order seasons 
                                await sortListSeasons();
                                // save new data to json file
                                await saveExtSeasonsToJsonFile(pathSeasonsDataJson, listSeasons);
                                await loadSeasonsJsonFile(pathSeasonsDataJson);      
                                            
                                //listSeasons = listSeasons.sort((a, b) => a.year - b.year);
                                // verify if new item was inserted
                                findSeason = listSeasons.filter(
                                    (itemSeason)=> {
                                        if (itemSeason.year === newSeason.year) {
                                            newSeason = itemSeason;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findSeason.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[year: ${newSeason.year}] inserted!`, 
                                        "newSeason": findSeason};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[year: ${newSeason.year}] wasn't inserted!`,
                                        "newSeason": newSeason};
                                }
                            } else {
                                // season alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[year: ${newSeason.year}] already created!`,
                                    "newSeason": newSeason};
                            }

                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[year: ${newSeason.year}] must be a positive number!`,
                                "newSeason": newSeason};                                  
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send season data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newSeason};
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
