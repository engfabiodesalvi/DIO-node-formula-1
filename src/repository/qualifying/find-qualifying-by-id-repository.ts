import { FastifyReply, FastifyRequest } from "fastify";
import { QualifyingModel } from "../../models/data/qualifying-model";
import { listQualifyings } from "./load-qualifyings-repository";
import { QualifyingParams } from "../../models/params/qualifying-params-model";

// GET - Find qualifying by Id
export const repositoryFindQualifyingById = async (
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
            let qualifyings:Partial<QualifyingModel> = {};
            if (listQualifyings.length > 0) { 
                const pitStopParams = request.params as QualifyingParams;
                if (pitStopParams.qualifyId) {
                    const qualifyId = parseInt(pitStopParams.qualifyId) || 0;
                    if ((qualifyId > 0) && Number.isInteger(parseFloat(pitStopParams.qualifyId) || 0)) {
                        qualifyings = listQualifyings.filter((pitStopItem) => {
                            if (qualifyId > 0) {
                                if (!(pitStopItem.qualifyId === qualifyId)) {
                                    //console.info(`${pitStopItem.qualifyId} - ${qualifyId}`);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }) as unknown as QualifyingModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[qualifyId: ${pitStopParams.qualifyId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send qualifyId to be find!"} 
                }
            }

            if (!(qualifyings)) {
                response.type("application/json").code(404);
                return { message: "Qualifying Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "qualifyings": qualifyings };
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