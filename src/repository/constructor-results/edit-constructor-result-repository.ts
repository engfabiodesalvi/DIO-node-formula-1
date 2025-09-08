import { FastifyReply, FastifyRequest } from "fastify";
import { listConstructorResults, loadConstructorResultsJsonFile, pathConstructorResultsDataJson, saveExtConstructorResultsToJsonFile, sortListConstructorResults } from "./load-constructor-results-repository";
import { ConstructorResultModel } from "../../models/data/constructor-result-model";
import { isPartialConstructorResultModel } from "../../utils/isType/constructor-result-model/is-partial-constructorResultMode-type";

// PATCH - Edit a constructor result
export const repositoryEditConstructorResult = async (
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
                // check for editConstructorResult key in data body
                let foundKeyeditConstructorResult = false;
                for (const key in reqBody) {
                    if (key === "editConstructorResult")
                        foundKeyeditConstructorResult = true;
                }
                // proceed if the editConstructorResult object was found
                if (foundKeyeditConstructorResult) {
                    // obtain data from editConstructorResult object
                    let editConstructorResult = reqBody['editConstructorResult'] as ConstructorResultModel; 
                    console.log(editConstructorResult);
                    // check the data format partially match with ConstructorResultModel
                    if (await isPartialConstructorResultModel(editConstructorResult)) { 

                        // find constructorResultId in database
                        if (editConstructorResult.constructorResultsId > 0) {
                            // checking if the constructor result is aready registered
                            let itemMatch = false;
                            listConstructorResults.forEach(itemConstructorResult => {
                                if (itemConstructorResult.constructorResultsId === editConstructorResult.constructorResultsId) {
                                    // edit partially constructor result properties
                                    for (let key in editConstructorResult) {
                                        itemConstructorResult[key as keyof object] = editConstructorResult[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if results don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Constructor Result Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListConstructorResults();
                            // save insert/edit data to json file
                            await saveExtConstructorResultsToJsonFile(pathConstructorResultsDataJson, listConstructorResults);
                            await loadConstructorResultsJsonFile(pathConstructorResultsDataJson);       
                            
                            // find for inserted/edited constructor result
                            let foundConstructorResult = listConstructorResults.filter(
                                (itemConstructorResult)=> {
                                    if (itemConstructorResult.constructorResultsId === editConstructorResult.constructorResultsId) {
                                        console.log('Constructor Result found!');
                                        // load all data
                                        editConstructorResult = itemConstructorResult;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundConstructorResult.length === 0) {
                                    console.log("ConstructorResult wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[constructorResultsId: ${editConstructorResult.constructorResultsId}] wasn't edited!`,
                                        "editConstructorResult": editConstructorResult};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[constructorResultsId: ${editConstructorResult.constructorResultsId}] edited!`,
                                        "editConstructorResult": editConstructorResult};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorResultsId: ${editConstructorResult.constructorResultsId}] must be a positive number!`,
                                "editConstructorResult": editConstructorResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor result data to be edited!"}              
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
