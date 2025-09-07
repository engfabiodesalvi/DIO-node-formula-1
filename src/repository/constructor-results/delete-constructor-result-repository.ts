import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorResultModel } from "../../models/data/constructor-result-model";
import { isPartialConstructorResultModel } from "../../utils/isType/constructor-result-model/is-partial-constructorResultMode-type";
import { listConstructorResults, loadConstructorResultsJsonFile, pathConstructorResultsDataJson, saveExtConstructorResultsToJsonFile } from "./load-constructor-results-repository";

// DELETE - Delete a constructor result
export const repositoryDeleteConstructorResult = async (
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

                // check for deleteConstructorResult key in data body
                let foundKeyConstructorResult = false;
                for (const key in reqBody) {
                    if (key === "deleteConstructorResult")
                        foundKeyConstructorResult = true;
                }
                // proceed if the deleteConstructorResult object was found
                if (foundKeyConstructorResult) {
                    // obtain data from deleteConstructorResult object
                    let deleteConstructorResult = reqBody['deleteConstructorResult'] as ConstructorResultModel; 
                    // check the data format match parcially with ConstructorResultModel
                    if (await isPartialConstructorResultModel(deleteConstructorResult)) {
                        
                        // find constructorResultsId in database
                        if (deleteConstructorResult.constructorResultsId >=0) {
                            let foundConstructorResult = listConstructorResults.filter(
                                (itemConstructorResult)=> {
                                    if (itemConstructorResult.constructorResultsId === deleteConstructorResult.constructorResultsId) {
                                        deleteConstructorResult = itemConstructorResult;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if results match
                            if (foundConstructorResult.length > 0) {              
                                
                                const newListConstructorResults = listConstructorResults.filter(
                                    (itemConstructorResult)=> itemConstructorResult.constructorResultsId !== deleteConstructorResult.constructorResultsId);
                                                                
                                // save new data to json file
                                await saveExtConstructorResultsToJsonFile(pathConstructorResultsDataJson, newListConstructorResults);
                                await loadConstructorResultsJsonFile(pathConstructorResultsDataJson);

                                // find for deleted constructor result
                                foundConstructorResult = listConstructorResults.filter(
                                    (itemConstructorResult)=> {
                                        if (itemConstructorResult.constructorResultsId === deleteConstructorResult.constructorResultsId) {
                                            console.log('Constructor Result found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundConstructorResult.length === 0) {
                                    console.log("Constructor Result deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[constructorResultsId: ${deleteConstructorResult.constructorResultsId}] deleted!`,
                                        "deleteConstructorResult": deleteConstructorResult};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[constructorResultsId: ${deleteConstructorResult.constructorResultsId}] wasn't deleted!`,
                                        "deleteConstructorResult": deleteConstructorResult};                        
                                }
                            } else {
                                // constructor result alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[constructorResultsId: ${deleteConstructorResult.constructorResultsId}] wasn't found!`,
                                    "deleteConstructorResult": deleteConstructorResult};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorResultsId: ${deleteConstructorResult.constructorResultsId}] must be a positive number!`,
                                "deleteConstructorResult": deleteConstructorResult};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructorResultsId to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newDriver};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}

function loadConstructorresultsJsonFile(pathConstructorResultsDataJson: string) {
    throw new Error("Function not implemented.");
}

