import { FastifyReply, FastifyRequest } from "fastify";
import { SprintResultModel } from "../../models/data/sprint-result-model";
import { isPartialSprintResultModel } from "../../utils/isType/sprint-result-model/is-partial-sprintResultModel-type";
import { listSprintResults, loadSprintResultsJsonFile, pathSprintResultsDataJson, saveExtSprintResultsToJsonFile } from "./load-sprint-results-repository";

// DELETE - Delete a sprint result
export const repositoryDeleteSprintResult = async (
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

                // check for deleteSprintResult key in data body
                let foundKeySprintResult = false;
                for (const key in reqBody) {
                    if (key === "deleteSprintResult")
                        foundKeySprintResult = true;
                }
                // proceed if the deleteSprintResult object was found
                if (foundKeySprintResult) {
                    // obtain data from deleteSprintResult object
                    let deleteSprintResult = reqBody['deleteSprintResult'] as SprintResultModel; 
                    // check the data format match parcially with SprintResultModel
                    if (await isPartialSprintResultModel(deleteSprintResult)) {
                        
                        // find resultId
                        if (deleteSprintResult.resultId > 0) {
                            let foundSprintResult = listSprintResults.filter(
                                (itemSprintResult)=> {
                                    if (itemSprintResult.resultId === deleteSprintResult.resultId) {

                                        deleteSprintResult = itemSprintResult;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if stops match
                            if (foundSprintResult.length > 0) {              
                                
                                const newListSprintResults = listSprintResults.filter(
                                    (itemSprintResult)=> !(itemSprintResult.resultId === deleteSprintResult.resultId));
                                                                
                                // save new data to json file
                                await saveExtSprintResultsToJsonFile(pathSprintResultsDataJson, newListSprintResults);
                                await loadSprintResultsJsonFile(pathSprintResultsDataJson);

                                // find for deleted sprint result
                                foundSprintResult = listSprintResults.filter(
                                    (itemSprintResult)=> {
                                        if (itemSprintResult.resultId === deleteSprintResult.resultId) {

                                            console.log('Sprint Result found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundSprintResult.length === 0) {
                                    console.log("Sprint Result deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[resultId: ${deleteSprintResult.resultId}] deleted!`,
                                        "deleteSprintResult": deleteSprintResult};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[resultId: ${deleteSprintResult.resultId}] wasn't deleted!`,
                                        "deleteSprintResult": deleteSprintResult};                        
                                }
                            } else {
                                // sprint result alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[resultId: ${deleteSprintResult.resultId}] wasn't found!`,
                                    "deleteSprintResult": deleteSprintResult};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${deleteSprintResult.resultId}] must be a non-zero positive number!`,
                                "deleteSprintResult": deleteSprintResult};                
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
