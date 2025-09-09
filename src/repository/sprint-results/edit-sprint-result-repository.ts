import { FastifyReply, FastifyRequest } from "fastify";
import { SprintResultModel } from "../../models/data/sprint-result-model";
import { isPartialSprintResultModel } from "../../utils/isType/sprint-result-model/is-partial-sprintResultModel-type";
import { listSprintResults, loadSprintResultsJsonFile, pathSprintResultsDataJson, saveExtSprintResultsToJsonFile } from "./load-sprint-results-repository";
import { sortListResults } from "../results/load-results-repository";

// PATCH - Edit a sprint result
export const repositoryEditSprintResult = async (
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
                // check for editSprintResult key in data body
                let foundKeyResult = false;
                for (const key in reqBody) {
                    if (key === "editSprintResult")
                        foundKeyResult = true;
                }
                // proceed if the editSprintResult object was found
                if (foundKeyResult) {
                    // obtain data from editSprintResult object
                    let editSprintResult = reqBody['editSprintResult'] as SprintResultModel; 
                    console.log(editSprintResult);
                    // check the data format partially match with SprintResultModel
                    if (await isPartialSprintResultModel(editSprintResult)) { 

                        // find pitStopId resultId database
                        if (editSprintResult.resultId > 0) {
                            // checking if the result is aready registered
                            let itemMatch = false;
                            listSprintResults.forEach((itemSprintResult) => {
                                if (itemSprintResult.resultId === editSprintResult.resultId) {
                                        // edit partially sprint result properties
                                        for (let key in editSprintResult) {
                                            itemSprintResult[key as keyof object] = editSprintResult[key as keyof object];
                                        }
                                        itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if stops don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Sprint Result Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListResults();
                            // save insert/edit data to json file
                            await saveExtSprintResultsToJsonFile(pathSprintResultsDataJson, listSprintResults);
                            await loadSprintResultsJsonFile(pathSprintResultsDataJson);       
                            
                            // find for inserted/edited result
                            let foundSprintResult = listSprintResults.filter(
                                (itemSprintResult)=> {
                                if (itemSprintResult.resultId === editSprintResult.resultId) {
                                        console.log('Sprint Result found!');
                                        // load all data
                                        editSprintResult = itemSprintResult;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundSprintResult.length === 0) {
                                    console.log("Sprint Result wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[resultId: ${editSprintResult.resultId}] wasn't edited!`,
                                        "editSprintResult": editSprintResult};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[resultId: ${editSprintResult.resultId}] edited!`,
                                        "editSprintResult": editSprintResult};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${editSprintResult.resultId}] must be a positive number!`,
                                "editSprintResult": editSprintResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send sprint result data to be edited!"}              
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
