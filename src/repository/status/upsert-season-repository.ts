import { FastifyReply, FastifyRequest } from "fastify";
import { SeasonModel } from "../../models/data/season-model";
import { isSeasonModel } from "../../utils/isType/season-model/is-seasonModel-type";
import { listSeasons, loadSeasonsJsonFile, pathSeasonsDataJson, saveExtSeasonsToJsonFile, sortListSeasons } from "./load-seasons-repository";

// PUT - (Upsert) Edit or inser new season
export const repositoryUpsertSeason = async (
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
                // check for upsertSeason key in data body
                let foundKeyUpsertSeason = false;
                for (const key in reqBody) {
                    if (key === "upsertSeason")
                        foundKeyUpsertSeason = true;
                }
                // proceed if the upsertSeason object was found
                if (foundKeyUpsertSeason) {
                    // obtain data from upsertSeason object
                    let upsertSeason = reqBody['upsertSeason'] as SeasonModel; 
                    // check the data format match with SeasonModel
                    if (await isSeasonModel(upsertSeason)) { 

                        // checking if year > 0
                        if (upsertSeason.year > 0) {

                            // checking if the season is aready registered in database
                            let itemMatch = false;
                            listSeasons.forEach(itemSeason => {
                                if (itemSeason.year === upsertSeason.year) {
                                    // edit season properties
                                    itemSeason.url = upsertSeason.url;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if results don't match
                            if (!itemMatch) {
                                listSeasons.push(upsertSeason);                
                            }

                            // ascendant order seasonsId
                            await sortListSeasons();
                            // save insert/edit data to json file
                            await saveExtSeasonsToJsonFile(pathSeasonsDataJson, listSeasons);
                            await loadSeasonsJsonFile(pathSeasonsDataJson);       
                            
                            // find for inserted/edited season
                            let foundSeason = listSeasons.filter(
                                (itemSeason)=> {
                                    if (itemSeason.year === upsertSeason.year) {
                                        upsertSeason = itemSeason;
                                        console.log('Season found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundSeason.length === 0) {
                                    console.log("Season wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[year: ${upsertSeason.year}] wasn't inserted!`,
                                        "upsertSeason": upsertSeason};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[year: ${upsertSeason.year}] edited/inserted!`,
                                        "upsertSeason": upsertSeason};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[year: ${upsertSeason.year}] must be a positive number!`,
                                "upsertSeason": upsertSeason};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send season data to be edited/inserted!"}              
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