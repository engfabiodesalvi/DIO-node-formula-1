import { FastifyReply, FastifyRequest } from "fastify";
import { SprintResultParams } from "../../models/params/sprint-result-params-model";
import { SprintResultModel } from "../../models/data/sprint-result-model";
import { listSprintResults, loadSprintResultsJsonFile, pathSprintResultsDataJson, saveExtSprintResultsToJsonFile } from "./load-sprint-results-repository";


// DELETE - Delete a sprint result
export const repositoryDeleteSprintResultById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteResultId from params
            const resultParams = request.params as SprintResultParams;
            const deleteResultId = parseInt(resultParams.resultId) || 0;
            let deleteResult:Partial<SprintResultModel> = {
                resultId: deleteResultId
            };
            
            console.log(`${deleteResultId} `);

            // ckeck if deleteResultId > 0 
            if (deleteResultId > 0 ) {
                // find resultId in database
                let foundResult = listSprintResults.filter(
                    (itemResult)=> {
                        if (itemResult.resultId === deleteResultId) {

                            deleteResult = itemResult;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if sprint result match
                if (foundResult.length > 0) {              
                    
                                                    
                    // save new data to json file
                    await saveExtSprintResultsToJsonFile(pathSprintResultsDataJson, listSprintResults.filter(
                            (itemResult) => !(itemResult.resultId === deleteResult.resultId)));
                    await loadSprintResultsJsonFile(pathSprintResultsDataJson);

                    foundResult = listSprintResults.filter(
                        (itemResult)=> {
                        if (itemResult.resultId === deleteResultId) {
                                console.log('Result found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundResult.length === 0) {
                        console.log("Result deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[resultId: ${deleteResult.resultId}] deleted!`,
                            "deleteResult": deleteResult};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[resultId: ${deleteResult.resultId}] wasn't deleted!`,
                            "deleteResult": deleteResult};                        
                    }
                } else {
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[resultId: ${deleteResult.resultId}] wasn't found!`,
                        "deleteResult": deleteResult};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[resultId: ${deleteResult.resultId}] must be a non-zero positive number!`};                
            }

        //return {"message": "Bearer Token ok!", newCircuit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}


