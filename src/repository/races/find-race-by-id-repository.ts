import { FastifyReply, FastifyRequest } from "fastify";
import { RaceModel } from "../../models/data/race-model";
import { listRaces } from "./load-races-repository";
import { RaceParams } from "../../models/params/race-params-model";

// GET - Find race by Id
export const repositoryFindRaceById = async (
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
            let races:Partial<RaceModel> = {};
            if (listRaces.length > 0) { 
                const raceParams = request.params as RaceParams;
                if (raceParams.raceId) {
                    const raceId = parseInt(raceParams.raceId) || 0;
                    if ((raceId > 0) && Number.isInteger(parseFloat(raceParams.raceId) || 0)) {
                        races = listRaces.filter((raceItem) => {
                            if (raceId > 0) {
                                if (!(raceItem.raceId === raceId)) {
                                    //console.info(`${raceItem.raceId} - ${raceId}`);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }) as unknown as RaceModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[raceId: ${raceParams.raceId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send raceId to be find!"} 
                }
            }

            if (!(races)) {
                response.type("application/json").code(404);
                return { message: "Race Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "races": races };
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