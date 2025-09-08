import { FastifyReply, FastifyRequest } from "fastify";
import { PitStopModel } from "../../models/data/pit-stop-model";
import { listPitStops } from "./load-pit-stops-repository";
import { PitStopParams } from "../../models/params/pit-stop-params-model";


// GET - Find pit stop by Id
export const repositoryFindPitStopsById = async (
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
            let pitStops:Partial<PitStopModel> = {};
            if (listPitStops.length > 0) { 
                const pitStopParams = request.params as PitStopParams;
                if (pitStopParams.raceId) {
                    const raceId = parseInt(pitStopParams.raceId) || 0;
                    if ((raceId > 0) && Number.isInteger(parseFloat(pitStopParams.raceId) || 0)) {
                        pitStops = listPitStops.filter((pitStopItem) => {
                            if (raceId > 0) {
                                if (!(pitStopItem.raceId === raceId)) {
                                    //console.info(`${pitStopItem.raceId} - ${raceId}`);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }) as unknown as PitStopModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[raceId: ${pitStopParams.raceId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send raceId to be find!"} 
                }
            }

            if (!(pitStops)) {
                response.type("application/json").code(404);
                return { message: "Pit Stop Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "pitStops": pitStops };
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