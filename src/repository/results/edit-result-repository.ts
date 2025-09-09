import { FastifyReply, FastifyRequest } from "fastify";
import { ResultModel } from "../../models/data/result-model";
import { isPartialResultModel } from "../../utils/isType/result-model/is-partial-resultModel-type";
import { listResults, loadResultsJsonFile, pathResultsDataJson, saveExtResultsToJsonFile, sortListResults } from "./load-results-repository";

// PATCH - Edit a result
export const repositoryEditResult = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {
            
            // ckeck if reqBody is defined
            if (reqBody) {            
                // check for editResult key in data body
                let foundKeyResult = false;
                for (const key in reqBody) {
                    if (key === "editResult")
                        foundKeyResult = true;
                }
                // proceed if the editResult object was found
                if (foundKeyResult) {
                    // obtain data from editResult object
                    let editResult = reqBody['editResult'] as ResultModel; 
                    console.log(editResult);
                    // check the data format partially match with ResultModel
                    if (await isPartialResultModel(editResult)) { 

                        // find pitStopId resultId database
                        if (editResult.resultId > 0) {
                            // checking if the result is aready registered
                            let itemMatch = false;
                            listResults.forEach((itemResult) => {
                                if (itemResult.resultId === editResult.resultId) {
                                        // edit partially result properties
                                        for (let key in editResult) {
                                            itemResult[key as keyof object] = editResult[key as keyof object];
                                        }
                                        itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if stops don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Result Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListResults();
                            // save insert/edit data to json file
                            await saveExtResultsToJsonFile(pathResultsDataJson, listResults);
                            await loadResultsJsonFile(pathResultsDataJson);       
                            
                            // find for inserted/edited result
                            let foundResult = listResults.filter(
                                (itemResult)=> {
                                if (itemResult.resultId === editResult.resultId) {
                                        console.log('Result found!');
                                        // load all data
                                        editResult = itemResult;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundResult.length === 0) {
                                    console.log("Result wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[resultId: ${editResult.resultId}] wasn't edited!`,
                                        "editResult": editResult};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[resultId: ${editResult.resultId}] edited!`,
                                        "editResult": editResult};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${editResult.resultId}] must be a positive number!`,
                                "editResult": editResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send result data to be edited!"}              
                }

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                
            
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }  

}
