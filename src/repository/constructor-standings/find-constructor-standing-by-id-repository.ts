import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorStandingModel } from "../../models/data/constructor-standing-model";
import { listConstructorStandings } from "./load-constructor-standings-repository";
import { ConstructorStandingParams } from "../../models/params/constructor-standing-params-model";


// GET - Find constructor standing by Id
export const repositoryFindConstructorStandingById = async (
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
            let constructorStandings:Partial<ConstructorStandingModel> = {};
            if (listConstructorStandings.length > 0) { 
                const constructorStandingParams = request.params as ConstructorStandingParams;
                if (constructorStandingParams.constructorStandingsId) {
                    const constructorStandingsId = parseInt(constructorStandingParams.constructorStandingsId) || 0;
                    if ((constructorStandingsId > 0) && Number.isInteger(parseFloat(constructorStandingParams.constructorStandingsId) || 0)) {
                        constructorStandings = listConstructorStandings.find((constructorStandingItem) => {              
                            if (constructorStandingsId > 0) {
                                if (!(constructorStandingItem.constructorStandingsId === constructorStandingsId)) {
                                    console.info(`${constructorStandingItem.constructorStandingsId} - ${constructorStandingsId}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as ConstructorStandingModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[constructorStandingsId: ${constructorStandingParams.constructorStandingsId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructorStandingsId to be find!"} 
                }
            }

            if (!(constructorStandings)) {
                response.type("application/json").code(404);
                return { message: "Constructor Standing Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "constructorStandings": constructorStandings };
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