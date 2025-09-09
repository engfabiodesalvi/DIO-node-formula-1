
import { FastifyReply, FastifyRequest } from "fastify";
import { ResultModel } from "../../models/data/result";
import { listResults } from "../results/load-results-repository";
import { ResultParams } from "../../models/params/result-params-model";

// GET - Find result by Id
export const repositoryFindResultById = async (
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
            let results:Partial<ResultModel> = {};
            if (listResults.length > 0) { 
                const resultParams = request.params as ResultParams;
                if (resultParams.resultId) {
                    const resultId = parseInt(resultParams.resultId) || 0;
                    if ((resultId > 0) && Number.isInteger(parseFloat(resultParams.resultId) || 0)) {
                        results = listResults.filter((resultItem) => {
                            if (resultId > 0) {
                                if (!(resultItem.resultId === resultId)) {
                                    //console.info(`${resultItem.resultId} - ${resultId}`);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }) as unknown as ResultModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[resultId: ${resultParams.resultId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send resultId to be find!"} 
                }
            }

            if (!(results)) {
                response.type("application/json").code(404);
                return { message: "Result Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "results": results };
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

