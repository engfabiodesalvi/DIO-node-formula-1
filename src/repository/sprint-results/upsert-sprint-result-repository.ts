import { FastifyReply, FastifyRequest } from "fastify";
import { SprintResultModel } from "../../models/data/sprint-result-model";
import { isSprintResultModel } from "../../utils/isType/sprint-result-model/is-sprintResultModel-type";
import { listSprintResults, loadSprintResultsJsonFile, pathSprintResultsDataJson, saveExtSprintResultsToJsonFile, sortListSprintResults } from "./load-sprint-results-repository";

// PUT - (Upsert) Edit or inser new result
export const repositoryUpsertSprintResult = async (
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
                // check for upsertSprintResult key in data body
                let foundKeyUpsertSprintResult = false;
                for (const key in reqBody) {
                    if (key === "upsertSprintResult")
                        foundKeyUpsertSprintResult = true;
                }
                // proceed if the upsertSprintResult object was found
                if (foundKeyUpsertSprintResult) {
                    // obtain data from upsertSprintResult object
                    let upsertSprintResult = reqBody['upsertSprintResult'] as SprintResultModel; 
                    // check the data format match with SprintResultModel
                    if (await isSprintResultModel(upsertSprintResult)) { 

                        // find resultId in database
                        if (upsertSprintResult.resultId > 0) {
                            // checking if the result is aready registered
                            let itemMatch = false;
                            listSprintResults.forEach(itemSprintResult => {
                                if (itemSprintResult.resultId === upsertSprintResult.resultId) {

                                    // edit result properties
                                    itemSprintResult.raceId = upsertSprintResult.raceId;
                                    itemSprintResult.driverId = upsertSprintResult.driverId;
                                    itemSprintResult.constructorId = upsertSprintResult.constructorId;
                                    itemSprintResult.number = upsertSprintResult.number;
                                    itemSprintResult.grid = upsertSprintResult.grid;
                                    itemSprintResult.position = upsertSprintResult.position;
                                    itemSprintResult.positionText = upsertSprintResult.positionText;
                                    itemSprintResult.positionOrder = upsertSprintResult.positionOrder;
                                    itemSprintResult.points = upsertSprintResult.points;
                                    itemSprintResult.laps = upsertSprintResult.laps;
                                    itemSprintResult.time = upsertSprintResult.time;
                                    itemSprintResult.milliseconds = upsertSprintResult.milliseconds;
                                    itemSprintResult.fastestLap = upsertSprintResult.fastestLap;
                                    itemSprintResult.fastestLapTime = upsertSprintResult.fastestLapTime;
                                    itemSprintResult.statusId = upsertSprintResult.statusId;
                                    
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if times don't match
                            if (!itemMatch) {
                                listSprintResults.push(upsertSprintResult);                
                            }

                            // ascendant order resultId 
                            await sortListSprintResults();
                            // save insert/edit data to json file
                            await saveExtSprintResultsToJsonFile(pathSprintResultsDataJson, listSprintResults);
                            await loadSprintResultsJsonFile(pathSprintResultsDataJson);       
                            
                            // find for inserted/edited result
                            let foundSprintResult = listSprintResults.filter(
                                (itemSprintResult)=> {
                                    if (itemSprintResult.resultId === upsertSprintResult.resultId) {

                                        upsertSprintResult = itemSprintResult;
                                        console.log('Sprint Result found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundSprintResult.length === 0) {
                                    console.log("Sprint Result wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[resultId: ${upsertSprintResult.resultId}] wasn't inserted!`,
                                        "upsertSprintResult": upsertSprintResult};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[resultId: ${upsertSprintResult.resultId}] edited!`,
                                            "upsertSprintResult": upsertSprintResult};                                       
                                    } else {
                                        response.type("application/json").code(201); // Create
                                        return {
                                            "message": `[resultId: ${upsertSprintResult.resultId}] inserted!`,
                                            "upsertSprintResult": upsertSprintResult};                                           
                                    }                                                           
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${upsertSprintResult.resultId}] must be a non-zer positive number!`,
                                "upsertSprintResult": upsertSprintResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send sprint result data to be edited/inserted!"}              
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