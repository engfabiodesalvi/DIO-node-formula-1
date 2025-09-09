import { FastifyReply, FastifyRequest } from "fastify";
import { SeasonParams } from "../../models/params/season-params-model";
import { SeasonModel } from "../../models/data/season-model";
import { listSeasons, loadSeasonsJsonFile, pathSeasonsDataJson, saveExtSeasonsToJsonFile } from "./load-seasons-repository";

// DELETE - Delete a season
export const repositoryDeleteSeasonById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteSeasonId from params
            const seasonParams = request.params as SeasonParams;
            const deleteSeasonId = parseInt(seasonParams.year) || 0;
            let deleteSeason:Partial<SeasonModel> = {year: deleteSeasonId};
            
            console.log(deleteSeasonId);

            // ckeck if deleteSeasonId is > 0
            if (deleteSeasonId > 0) {
                // find year in database
                let foundSeason = listSeasons.filter(
                    (itemSeason)=> {
                        if (itemSeason.year === deleteSeasonId) {
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
                        console.log("Drever deleted");
                        response.type("application/json").code(200); // not content                                    
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
                    "message": `[year: ${deleteSeason.year}] must be a positive number!`};                
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
