import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorResultModel } from "../../models/data/constructor-result-model";
import { isConstructorResultModel } from "../../utils/isType/constructor-result-model/is-constructorResultModel-type";
import { listConstructorResults, loadConstructorResultsJsonFile, pathConstructorResultsDataJson, saveExtConstructorResultsToJsonFile, sortListConstructorResults } from "./load-constructor-results-repository";

// POST - Create/insert new constructor result
export const repositoryNewConstructorResult = async (
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
                // check for newConstructorResult key in data body
                let foundKeyNewConstructorResult = false;
                for (const key in reqBody) {
                    if (key === "newConstructorResult")
                        foundKeyNewConstructorResult = true;            
                }
                // proceed if the newConstructorResult object was found
                if (foundKeyNewConstructorResult) {
                    // obtain data from newConstructorResult object
                    let newConstructorResult = reqBody['newConstructorResult'] as ConstructorResultModel; 
                    // check the data format match with ConstructorResultModel
                    if (await isConstructorResultModel(newConstructorResult)) { 

                        // checking if constructorResultsId > 0
                        if (newConstructorResult.constructorResultsId > 0) {

                            // find new constructor result id in database
                            let findConstructorResult = listConstructorResults.filter(
                                (itemConstructorResult)=> itemConstructorResult.constructorResultsId === newConstructorResult.constructorResultsId);

                            // insert new item if no results match
                            if (findConstructorResult.length === 0) {              
                                listConstructorResults.push(newConstructorResult);

                                // ascendant order constructor results 
                                await sortListConstructorResults();
                                // save new data to json file
                                await saveExtConstructorResultsToJsonFile(pathConstructorResultsDataJson, listConstructorResults);
                                await loadConstructorResultsJsonFile(pathConstructorResultsDataJson);      
                                            
                                //listConstructorResults = listConstructorResults.sort((a, b) => a.constructorResultsId - b.constructorResultsId);
                                // verify if new item was inserted
                                findConstructorResult = listConstructorResults.filter(
                                    (itemConstructorResult)=> {
                                        if (itemConstructorResult.constructorResultsId === newConstructorResult.constructorResultsId) {
                                            newConstructorResult = itemConstructorResult;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findConstructorResult.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[constructorResultsId: ${newConstructorResult.constructorResultsId}] inserted!`, 
                                        "newConstructorResult": findConstructorResult};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[constructorResultsId: ${newConstructorResult.constructorResultsId}] wasn't inserted!`,
                                        "newConstructorResult": newConstructorResult};
                                }
                            } else {
                                // constructor result alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[constructorResultsId: ${newConstructorResult.constructorResultsId}] already created!`,
                                    "newConstructorResult": newConstructorResult};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorResultsId: ${newConstructorResult.constructorResultsId}] must be a positive number!`,
                                "newConstructorResult": newConstructorResult};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor result data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newConstructorResult};
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
