import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorResultModel } from "../../models/data/constructor-result-model";
import { isConstructorResultModel } from "../../utils/isType/constructor-result-model/is-constructorResultModel-type";
import { listConstructorResults, loadConstructorResultsJsonFile, pathConstructorResultsDataJson, saveExtConstructorResultsToJsonFile, sortListConstructorResults } from "./load-constructor-results-repository";

// PUT - (Upsert) Edit or inser new constructor result
export const repositoryUpsertConstructorResult = async (
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
                // check for upsertConstructorResult key in data body
                let foundKeyupsertConstructorResult = false;
                for (const key in reqBody) {
                    if (key === "upsertConstructorResult")
                        foundKeyupsertConstructorResult = true;
                }
                // proceed if the upsertConstructorResult object was found
                if (foundKeyupsertConstructorResult) {
                    // obtain data from upsertConstructorResult object
                    let upsertConstructorResult = reqBody['upsertConstructorResult'] as ConstructorResultModel; 
                    // check the data format match with ConstructorResultModel
                    if (await isConstructorResultModel(upsertConstructorResult)) { 

                        // find constructorResultsId in database
                        if (upsertConstructorResult.constructorResultsId > 0) {
                            // checking if the driver is aready registered
                            let itemMatch = false;
                            listConstructorResults.forEach(itemConstructorResult => {
                                if (itemConstructorResult.constructorResultsId === upsertConstructorResult.constructorResultsId) {
                                    // edit constructor result properties
                                    itemConstructorResult.raceId = upsertConstructorResult.raceId;
                                    itemConstructorResult.constructorId = upsertConstructorResult.constructorId;
                                    itemConstructorResult.points = upsertConstructorResult.points;
                                    itemConstructorResult.status = upsertConstructorResult.status;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if results don't match
                            if (!itemMatch) {
                                listConstructorResults.push(upsertConstructorResult);                
                            }

                            // ascendant order constructorResultsId 
                            await sortListConstructorResults();
                            // save insert/edit data to json file
                            await saveExtConstructorResultsToJsonFile(pathConstructorResultsDataJson, listConstructorResults);
                            await loadConstructorResultsJsonFile(pathConstructorResultsDataJson);       
                            
                            // find for inserted/edited constructor result
                            let foundConstructorResult = listConstructorResults.filter(
                                (itemConstructorResult)=> {
                                    if (itemConstructorResult.constructorResultsId === upsertConstructorResult.constructorResultsId) {
                                        upsertConstructorResult = itemConstructorResult;
                                        console.log('Constructor Result found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundConstructorResult.length === 0) {
                                    console.log("Constructor Result wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[constructorResultsId: ${upsertConstructorResult.constructorResultsId}] wasn't inserted!`,
                                        "upsertConstructorResult": upsertConstructorResult};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {                                    
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[constructorResultsId: ${upsertConstructorResult.constructorResultsId}] edited!`,
                                            "upsertConstructorResult": upsertConstructorResult};   
                                    } else {
                                        response.type("application/json").code(201); // Create
                                        return {
                                            "message": `[constructorResultsId: ${upsertConstructorResult.constructorResultsId}] inserted!`,
                                            "upsertConstructorResult": upsertConstructorResult};                                         
                                    }                     
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorResultsId: ${upsertConstructorResult.constructorResultsId}] must be a positive number!`,
                                "upsertConstructorResult": upsertConstructorResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor result data to be edited/inserted!"}              
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