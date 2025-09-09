
import { FastifyReply, FastifyRequest } from "fastify";
import { SeasonModel } from "../../models/data/season";
import { isPartialSeasonModel } from "../../utils/isType/season-model/is-partial-seasonModel-type";
import { listSeasons, loadSeasonsJsonFile, pathSeasonsDataJson, saveExtSeasonsToJsonFile } from "./load-seasons-repository";

// DELETE - Delete a season
export const repositoryDeleteSeason = async (
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

                // check for deleteSeason key in data body
                let foundKeyDeleteSeason = false;
                for (const key in reqBody) {
                    if (key === "deleteSeason")
                        foundKeyDeleteSeason = true;
                }
                // proceed if the deleteSeason object was found
                if (foundKeyDeleteSeason) {
                    // obtain data from deleteSeason object
                    let deleteSeason = reqBody['deleteSeason'] as SeasonModel; 
                    // check the data format match parcially with SeasonModel
                    if (await isPartialSeasonModel(deleteSeason)) {
                        
                        // find year in database
                        if (deleteSeason.year >=0) {
                            let foundSeason = listSeasons.filter(
                                (itemSeason)=> {
                                    if (itemSeason.year === deleteSeason.year) {
                                        deleteSeason = itemSeason;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if results match
                            if (foundSeason.length > 0) {              
                                
                                const newListSeasons = listSeasons.filter(
                                    (itemSeason)=> itemSeason.year !== deleteSeason.year);
                                                                
                                // save new data to json file
                                await saveExtSeasonsToJsonFile(pathSeasonsDataJson, newListSeasons);
                                await loadSeasonsJsonFile(pathSeasonsDataJson);

                                // find for deleted season
                                foundSeason = listSeasons.filter(
                                    (itemSeason)=> {
                                        if (itemSeason.year === deleteSeason.year) {
                                            console.log('Season found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundSeason.length === 0) {
                                    console.log("Season deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[year: ${deleteSeason.year}] deleted!`,
                                        "deleteSeason": deleteSeason};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[year: ${deleteSeason.year}] wasn't deleted!`,
                                        "deleteSeason": deleteSeason};                        
                                }
                            } else {
                                // season alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[year: ${deleteSeason.year}] wasn't found!`,
                                    "deleteSeason": deleteSeason};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[year: ${deleteSeason.year}] must be a positive number!`,
                                "deleteSeason": deleteSeason};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send year to be deleted!"}              
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
}