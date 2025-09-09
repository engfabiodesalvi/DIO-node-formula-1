import { FastifyReply, FastifyRequest } from "fastify";
import { ResultModel } from "../../models/data/result";
import { isResultModel } from "../../utils/isType/result-model/is-resultModel-type";
import { listResults, loadResultsJsonFile, pathResultsDataJson, saveExtResultsToJsonFile, sortListResults } from "./load-results-repository";

// POST - Create/insert new result
export const repositoryNewResult = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // ckeck if reqBody is defined
            if (reqBody) {            
                // check for newResult key in data body
                let foundKeyNewResult = false;
                for (const key in reqBody) {
                    if (key === "newResult")
                        foundKeyNewResult = true;            
                }
                // proceed if the newResult object was found
                if (foundKeyNewResult) {
                    // obtain data from newResult object
                    let newResult = reqBody['newResult'] as ResultModel; 
                    // check the data format match with ResultModel
                    if (await isResultModel(newResult)) { 

                        // checking if resultId > 0
                        if (newResult.resultId > 0) {

                            // find new result resultId in database
                            let findResult = listResults.filter(
                                (itemResult) => itemResult.resultId === newResult.resultId);
                                

                            // insert new item if no stops match
                            if (findResult.length === 0) {              
                                listResults.push(newResult);

                                // ascendant order results 
                                await sortListResults();
                                // save new data to json file
                                await saveExtResultsToJsonFile(pathResultsDataJson, listResults);
                                await loadResultsJsonFile(pathResultsDataJson);      
                                            
                                //listResults = listResults.sort((a, b) => a.resultId - b.resultId);
                                // verify if new item was inserted
                                findResult = listResults.filter(
                                    (itemResult)=> {
                                        if (itemResult.resultId === newResult.resultId) {

                                            newResult = itemResult;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findResult.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[resultId: ${newResult.resultId}] inserted!`, 
                                        "newResult": findResult};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[resultId: ${newResult.resultId}] wasn't inserted!`,
                                        "newResult": newResult};
                                }
                            } else {
                                // result alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[resultId: ${newResult.resultId}] already created!`,
                                    "newResult": newResult};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${newResult.resultId}] must be a positive number!`,
                                "newResult": newResult};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send result data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newResult};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }


    //return request.headers.authorization;
}
