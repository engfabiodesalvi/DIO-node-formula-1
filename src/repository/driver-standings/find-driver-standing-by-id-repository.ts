import { FastifyReply, FastifyRequest } from "fastify";
import { DriverStandingModel } from "../../models/data/driver-standing-model";
import { listDriverStandings } from "./load-driver-standings-repository";
import { DriverStandingParams } from "../../models/params/driver-standing-params-model";


// GET - Find driver standing by Id
export const repositoryFindDriverStandingById = async (
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
            let driverStandings:Partial<DriverStandingModel> = {};
            if (listDriverStandings.length > 0) { 
                const driverStandingParams = request.params as DriverStandingParams;
                if (driverStandingParams.driverStandingsId) {
                    const driverStandingsId = parseInt(driverStandingParams.driverStandingsId) || 0;
                    if ((driverStandingsId > 0) && Number.isInteger(parseFloat(driverStandingParams.driverStandingsId) || 0)) {
                        driverStandings = listDriverStandings.find((driverStandingItem) => {              
                            if (driverStandingsId > 0) {
                                if (!(driverStandingItem.driverStandingsId === driverStandingsId)) {
                                    console.info(`${driverStandingItem.driverStandingsId} - ${driverStandingsId}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as DriverStandingModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[driverStandingsId: ${driverStandingParams.driverStandingsId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driverStandingsId to be find!"} 
                }
            }

            if (!(driverStandings)) {
                response.type("application/json").code(404);
                return { message: "Driver Standing Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "driverStandings": driverStandings };
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