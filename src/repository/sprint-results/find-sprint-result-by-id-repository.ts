
import { FastifyReply, FastifyRequest } from "fastify";
import { SprintResultModel } from "../../models/data/sprint-result-model";
import { listSprintResults } from "./load-sprint-results-repository";
import { SprintResultParams } from "../../models/params/sprint-result-params-model";

// GET - Find sprint sprintResult by Id
export const repositoryFindSprintResultById = async (
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
            let sprintResults:Partial<SprintResultModel> = {};
            if (listSprintResults.length > 0) { 
                const sprintResultParams = request.params as SprintResultParams;
                if (sprintResultParams.resultId) {
                    const resultId = parseInt(sprintResultParams.resultId) || 0;
                    if ((resultId > 0) && Number.isInteger(parseFloat(sprintResultParams.resultId) || 0)) {
                        sprintResults = listSprintResults.filter((sprintResultItem) => {
                            if (resultId > 0) {
                                if (!(sprintResultItem.resultId === resultId)) {
                                    //console.info(`${sprintResultItem.resultId} - ${resultId}`);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }) as unknown as SprintResultModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[resultId: ${sprintResultParams.resultId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send resultId to be find!"} 
                }
            }

            if (!(sprintResults)) {
                response.type("application/json").code(404);
                return { message: "SprintResult Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "sprintResults": sprintResults };
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

