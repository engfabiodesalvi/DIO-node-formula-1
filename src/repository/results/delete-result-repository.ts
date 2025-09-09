import { FastifyReply, FastifyRequest } from "fastify";
import { ResultModel } from "../../models/data/result-model";
import { isPartialResultModel } from "../../utils/isType/result-model/is-partial-resultModel-type";
import { listResults, loadResultsJsonFile, pathResultsDataJson, saveExtResultsToJsonFile } from "./load-results-repository";

// DELETE - Delete a result
export const repositoryDeleteResult = async (
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

                // check for deleteResult key in data body
                let foundKeyResult = false;
                for (const key in reqBody) {
                    if (key === "deleteResult")
                        foundKeyResult = true;
                }
                // proceed if the deleteResult object was found
                if (foundKeyResult) {
                    // obtain data from deleteResult object
                    let deleteResult = reqBody['deleteResult'] as ResultModel; 
                    // check the data format match parcially with ResultModel
                    if (await isPartialResultModel(deleteResult)) {
                        
                        // find resultId
                        if (deleteResult.resultId > 0) {
                            let foundResult = listResults.filter(
                                (itemResult)=> {
                                    if (itemResult.resultId === deleteResult.resultId) {

                                        deleteResult = itemResult;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if stops match
                            if (foundResult.length > 0) {              
                                
                                const newListResults = listResults.filter(
                                    (itemResult)=> !(itemResult.resultId === deleteResult.resultId));
                                                                
                                // save new data to json file
                                await saveExtResultsToJsonFile(pathResultsDataJson, newListResults);
                                await loadResultsJsonFile(pathResultsDataJson);

                                // find for deleted result
                                foundResult = listResults.filter(
                                    (itemResult)=> {
                                        if (itemResult.resultId === deleteResult.resultId) {

                                            console.log('Result found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundResult.length === 0) {
                                    console.log("Result deleted");
                                    response.type("application/json").code(200); // Ok                                    
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
                                // result alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[resultId: ${deleteResult.resultId}] wasn't found!`,
                                    "deleteResult": deleteResult};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${deleteResult.resultId}] must be a non-zero positive number!`,
                                "deleteResult": deleteResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send resultId to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newPit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
