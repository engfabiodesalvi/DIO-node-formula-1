
import { FastifyReply, FastifyRequest } from "fastify";
import { SeasonModel } from "../../models/data/season-model";
import { SeasonParams } from "../../models/params/season-params-model";
import { listSeasons } from "./load-seasons-repository";

// GET - Find season by Id
export const repositoryFindSeasonById = async (
    request: FastifyRequest,
    response: FastifyReply,      
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // partially initialized variable
            let season:Partial<SeasonModel> = {};
            if (listSeasons.length > 0) { 
                const seasonParams = request.params as SeasonParams;
                if (seasonParams.year) {
                    const year = parseInt(seasonParams.year) || 0;
                    if ((year > 0) && Number.isInteger(parseFloat(seasonParams.year) || 0)) {
                        season = listSeasons.find((seasonItem) => {              
                            if (year > 0) {
                                if (!(seasonItem.year === year)) {
                                    console.info(`${seasonItem.year} - ${year}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as SeasonModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[year: ${seasonParams.year}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send year to be find!"} 
                }
            }

            if (!(season)) {
                response.type("application/json").code(404);
                return { message: "Season Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "season": season };
            }   
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }            
};