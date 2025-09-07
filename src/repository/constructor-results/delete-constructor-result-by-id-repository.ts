import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorResultParams } from "../../models/params/constructor-result-params-model";
import { ConstructorResultModel } from "../../models/data/constructor-result-model";
import { listConstructorResults, loadConstructorResultsJsonFile, pathConstructorResultsDataJson, saveExtConstructorResultsToJsonFile } from "./load-constructor-results-repository";

// DELETE - Delete a constructor result
export const repositoryDeleteConstructorResultById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteConstructorId from params
            const constructorResultParams = request.params as ConstructorResultParams;
            const deleteConstructorResultsId = parseInt(constructorResultParams.constructorResultsId) || 0;
            let deleteConstructorResult:Partial<ConstructorResultModel> = {constructorResultsId: deleteConstructorResultsId};
            
            console.log(deleteConstructorResultsId);

            // ckeck if deleteConstructorResultsId is > 0
            if (deleteConstructorResultsId > 0) {
                // find constructorResultsId in database
                let foundConstructrorResult = listConstructorResults.filter(
                    (itemConstructorResult)=> {
                        if (itemConstructorResult.constructorResultsId === deleteConstructorResultsId) {
                            deleteConstructorResult = itemConstructorResult;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if results match
                if (foundConstructrorResult.length > 0) {              
                    
                    const newListConstructorResults = listConstructorResults.filter(
                        (itemConstuctorResult)=> itemConstuctorResult.constructorResultsId !== deleteConstructorResult.constructorResultsId);
                                                    
                    // save new data to json file
                    await saveExtConstructorResultsToJsonFile(pathConstructorResultsDataJson, newListConstructorResults);
                    await loadConstructorResultsJsonFile(pathConstructorResultsDataJson);

                    foundConstructrorResult = listConstructorResults.filter(
                        (itemConstructorResult)=> {
                            if (itemConstructorResult.constructorResultsId === deleteConstructorResult.constructorResultsId) {
                                console.log('Constructor Result found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundConstructrorResult.length === 0) {
                        console.log("Constructor Result deleted");
                        response.type("application/json").code(200); // not content                                    
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
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[constructorResultsId: ${deleteConstructorResult.constructorResultsId}] wasn't found!`,
                        "deleteConstructorResult": deleteConstructorResult};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[constructorResultsId: ${deleteConstructorResult.constructorResultsId}] must be a positive number!`};                
            }

        //return {"message": "Bearer Token ok!", newCircuit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
function loadConstructorResultJsonFile(pathCircuitsDataJson: any) {
    throw new Error("Function not implemented.");
}

