import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorResultModel } from "../../models/data/constructor-result-model";
import { listConstructorResults } from "./load-constructor-results-repository";
import { ConstructorResultParams } from "../../models/params/constructor-result-params-model";

// GET - Find constructor result by Id
export const repositoryFindConstructorResultById = async (
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
            let constructorResults:Partial<ConstructorResultModel> = {};
            if (listConstructorResults.length > 0) { 
                const constructorResultParams = request.params as ConstructorResultParams;
                if (constructorResultParams.constructorResultsId) {
                    const constructorResultsId = parseInt(constructorResultParams.constructorResultsId) || 0;
                    if ((constructorResultsId > 0) && Number.isInteger(parseFloat(constructorResultParams.constructorResultsId) || 0)) {
                        constructorResults = listConstructorResults.find((constructorResultItem) => {              
                            if (constructorResultsId > 0) {
                                if (!(constructorResultItem.constructorResultsId === constructorResultsId)) {
                                    console.info(`${constructorResultItem.constructorResultsId} - ${constructorResultsId}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as ConstructorResultModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[constructorResultsId: ${constructorResultParams.constructorResultsId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructorResultsId to be find!"} 
                }
            }

            if (!(constructorResults)) {
                response.type("application/json").code(404);
                return { message: "Circuit Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "constructorResults": constructorResults };
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