import { FastifyReply, FastifyRequest } from "fastify";
import { ResultModel } from "../../models/data/result-model";
import { isResultModel } from "../../utils/isType/result-model/is-resultModel-type";
import { listResults, loadResultsJsonFile, pathResultsDataJson, saveExtResultsToJsonFile, sortListResults } from "./load-results-repository";

// PUT - (Upsert) Edit or inser new result
export const repositoryUpsertResult = async (
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
                // check for upsertResult key in data body
                let foundKeyUpsertResult = false;
                for (const key in reqBody) {
                    if (key === "upsertResult")
                        foundKeyUpsertResult = true;
                }
                // proceed if the upsertResult object was found
                if (foundKeyUpsertResult) {
                    // obtain data from upsertResult object
                    let upsertResult = reqBody['upsertResult'] as ResultModel; 
                    // check the data format match with ResultModel
                    if (await isResultModel(upsertResult)) { 

                        // find resultId in database
                        if (upsertResult.resultId > 0) {
                            // checking if the result is aready registered
                            let itemMatch = false;
                            listResults.forEach(itemResult => {
                                if (itemResult.resultId === upsertResult.resultId) {

                                    // edit result properties
                                    itemResult.raceId = upsertResult.raceId;
                                    itemResult.driverId = upsertResult.driverId;
                                    itemResult.constructorId = upsertResult.constructorId;
                                    itemResult.number = upsertResult.number;
                                    itemResult.grid = upsertResult.grid;
                                    itemResult.position = upsertResult.position;
                                    itemResult.positionText = upsertResult.positionText;
                                    itemResult.positionOrder = upsertResult.positionOrder;
                                    itemResult.points = upsertResult.points;
                                    itemResult.laps = upsertResult.laps;
                                    itemResult.time = upsertResult.time;
                                    itemResult.milliseconds = upsertResult.milliseconds;
                                    itemResult.fastestLap = upsertResult.fastestLap;
                                    itemResult.rank = upsertResult.rank;
                                    itemResult.fastestLapTime = upsertResult.fastestLapTime;
                                    itemResult.fastestLapSpeed = upsertResult.fastestLapSpeed;
                                    itemResult.statusId = upsertResult.statusId;
                                    
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if times don't match
                            if (!itemMatch) {
                                listResults.push(upsertResult);                
                            }

                            // ascendant order resultId 
                            await sortListResults();
                            // save insert/edit data to json file
                            await saveExtResultsToJsonFile(pathResultsDataJson, listResults);
                            await loadResultsJsonFile(pathResultsDataJson);       
                            
                            // find for inserted/edited result
                            let foundResult = listResults.filter(
                                (itemResult)=> {
                                    if (itemResult.resultId === upsertResult.resultId) {

                                        upsertResult = itemResult;
                                        console.log('Result found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundResult.length === 0) {
                                    console.log("Result wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[resultId: ${upsertResult.resultId}] wasn't inserted!`,
                                        "upsertResult": upsertResult};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[resultId: ${upsertResult.resultId}] edited!`,
                                            "upsertResult": upsertResult};                                           
                                    } else {
                                        response.type("application/json").code(201); // Create
                                        return {
                                            "message": `[resultId: ${upsertResult.resultId}] inserted!`,
                                            "upsertResult": upsertResult};                                             
                                    }                                                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[resultId: ${upsertResult.resultId}] must be a non-zer positive number!`,
                                "upsertResult": upsertResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send result data to be edited/inserted!"}              
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