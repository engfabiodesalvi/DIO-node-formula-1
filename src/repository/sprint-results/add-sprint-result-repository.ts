import { FastifyReply, FastifyRequest } from "fastify";
import { SprintResultModel } from "../../models/data/sprint-result-model";
import { isSprintResultModel } from "../../utils/isType/sprint-result-model/is-sprintResultModel-type";
import { listSprintResults, loadSprintResultsJsonFile, pathSprintResultsDataJson, saveExtSprintResultsToJsonFile, sortListSprintResults } from "./load-sprint-results-repository";

// POST - Create/insert new sprint result
export const repositoryNewSprintResult = async (
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
                // check for newSprintResult key in data body
                let foundKeyNewSprintResult = false;
                for (const key in reqBody) {
                    if (key === "newSprintResult")
                        foundKeyNewSprintResult = true;            
                }
                // proceed if the newSprintResult object was found
                if (foundKeyNewSprintResult) {
                    // obtain data from newSprintResult object
                    let newSprintResult = reqBody['newSprintResult'] as SprintResultModel; 
                    // check the data format match with SprintResultModel
                    if (await isSprintResultModel(newSprintResult)) { 

                        // checking if resultId > 0
                        if (newSprintResult.resultId > 0) {

                            // find new sprint sprint result resultId in database
                            let findSprintResult = listSprintResults.filter(
                                (itemSprintResult) => itemSprintResult.resultId === newSprintResult.resultId);
                                

                            // insert new item if no stops match
                            if (findSprintResult.length === 0) {              
                                listSprintResults.push(newSprintResult);

                                // ascendant order results 
                                await sortListSprintResults();
                                // save new data to json file
                                await saveExtSprintResultsToJsonFile(pathSprintResultsDataJson, listSprintResults);
                                await loadSprintResultsJsonFile(pathSprintResultsDataJson);      
                                            
                                //listSprintResults = listSprintResults.sort((a, b) => a.resultId - b.resultId);
                                // verify if new item was inserted
                                findSprintResult = listSprintResults.filter(
                                    (itemSprintResult)=> {
                                        if (itemSprintResult.resultId === newSprintResult.resultId) {

                                            newSprintResult = itemSprintResult;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findSprintResult.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[resultId: ${newSprintResult.resultId}] inserted!`, 
                                        "newSprintResult": findSprintResult};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[resultId: ${newSprintResult.resultId}] wasn't inserted!`,
                                        "newSprintResult": newSprintResult};
                                }
                            } else {
                                // sprint sprint result alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[resultId: ${newSprintResult.resultId}] already created!`,
                                    "newSprintResult": newSprintResult};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${newSprintResult.resultId}] must be a positive number!`,
                                "newSprintResult": newSprintResult};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send sprint result data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newSprintResult};
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
