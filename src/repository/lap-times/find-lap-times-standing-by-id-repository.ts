import { FastifyReply, FastifyRequest } from "fastify";
import { LapTimeModel } from "../../models/data/lap-time-model";
import { listLapTimes } from "./load-lap-times-standings-repository";
import { LapTimeParams } from "../../models/params/lap-time-params-model";


// GET - Find lap time by Id
export const repositoryFindLapTimesById = async (
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
            let lapTimes:Partial<LapTimeModel> = {};
            if (listLapTimes.length > 0) { 
                const lapTimeParams = request.params as LapTimeParams;
                if (lapTimeParams.raceId) {
                    const raceId = parseInt(lapTimeParams.raceId) || 0;
                    if ((raceId > 0) && Number.isInteger(parseFloat(lapTimeParams.raceId) || 0)) {
                        lapTimes = listLapTimes.filter((lapTimeItem) => {
                            if (raceId > 0) {
                                if (!(lapTimeItem.raceId === raceId)) {
                                    //console.info(`${lapTimeItem.raceId} - ${raceId}`);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }) as unknown as LapTimeModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[raceId: ${lapTimeParams.raceId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send raceId to be find!"} 
                }
            }

            if (!(lapTimes)) {
                response.type("application/json").code(404);
                return { message: "Lap Time Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "lapTimes": lapTimes };
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