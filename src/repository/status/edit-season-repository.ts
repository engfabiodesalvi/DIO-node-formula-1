

import { FastifyReply, FastifyRequest } from "fastify";
import { SeasonModel } from "../../models/data/season-model";
import { isPartialSeasonModel } from "../../utils/isType/season-model/is-partial-seasonModel-type";
import { listSeasons, loadSeasonsJsonFile, pathSeasonsDataJson, saveExtSeasonsToJsonFile, sortListSeasons } from "./load-seasons-repository";

// PATCH - Edit a season
export const repositoryEditSeason = async (
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
                // check for editSeason key in data body
                let foundKeyEditSeason = false;
                for (const key in reqBody) {
                    if (key === "editSeason")
                        foundKeyEditSeason = true;
                }
                // proceed if the editSeason object was found
                if (foundKeyEditSeason) {
                    // obtain data from editSeason object
                    let editSeason = reqBody['editSeason'] as SeasonModel; 
                    console.log(editSeason);
                    // check the data format partially match with SeasonModel
                    if (await isPartialSeasonModel(editSeason)) { 

                        // find year in database
                        if (editSeason.year > 0) {
                            // checking if the season is aready registered
                            let itemMatch = false;
                            listSeasons.forEach(itemSeason => {
                                if (itemSeason.year === editSeason.year) {
                                    // edit partially season properties
                                    for (let key in editSeason) {
                                        itemSeason[key as keyof object] = editSeason[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if results don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Season Not Found" };                                                
                            }

                            // ascendant order seasons 
                            await sortListSeasons();
                            // save insert/edit data to json file
                            await saveExtSeasonsToJsonFile(pathSeasonsDataJson, listSeasons);
                            await loadSeasonsJsonFile(pathSeasonsDataJson);       
                            
                            // find for inserted/edited season
                            let foundSeason = listSeasons.filter(
                                (itemSeason)=> {
                                    if (itemSeason.year === editSeason.year) {
                                        console.log('Season found!');
                                        // load all data
                                        editSeason = itemSeason;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundSeason.length === 0) {
                                    console.log("Season wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[year: ${editSeason.year}] wasn't edited!`,
                                        "editSeason": editSeason};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[year: ${editSeason.year}] edited!`,
                                        "edittSeason": editSeason};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[year: ${editSeason.year}] must be a positive number!`,
                                "editSeason": editSeason};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send season data to be edited!"}              
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
