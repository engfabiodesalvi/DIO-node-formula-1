import { FastifyReply, FastifyRequest } from "fastify";
import { ResultParams } from "../../models/params/result-params-model";
import { ResultModel } from "../../models/data/result";
import { listResults, loadResultsJsonFile, pathResultsDataJson, saveExtResultsToJsonFile } from "./load-results-repository";

// DELETE - Delete a result
export const repositoryDeleteResultById = async (
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
            const resultParams = request.params as ResultParams;
            const deleteResultId = parseInt(resultParams.resultId) || 0;
            let deleteResult:Partial<ResultModel> = {
                resultId: deleteResultId
            };
            
            console.log(`${deleteResultId} `);

            // ckeck if deleteResultId > 0 
            if (deleteResultId > 0 ) {
                // find resultId in database
                let foundResult = listResults.filter(
                    (itemResult)=> {
                        if (itemResult.resultId === deleteResultId) {

                            deleteResult = itemResult;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if result match
                if (foundResult.length > 0) {              
                    
                    const newListResults = listResults.filter(
                        (itemResult)=> !(itemResult.resultId === deleteResult.resultId));
                                                    
                    // save new data to json file
                    await saveExtResultsToJsonFile(pathResultsDataJson, newListResults);
                    await loadResultsJsonFile(pathResultsDataJson);

                    foundResult = listResults.filter(
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


