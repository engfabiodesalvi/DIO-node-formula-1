import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorParams } from "../../models/params/constructor-params-model";
import { ConstructorModel } from "../../models/data/constructor";
import { listConstructors, loadConstructorsJsonFile, pathConstructorsDataJson, saveExtConstructorsToJsonFile } from "./load-constructor-repository";

// DELETE - Delete a constructor
export const repositoryDeleteConstructorById = async (
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
            const constructorParams = request.params as ConstructorParams;
            const deleteConstructorsId = parseInt(constructorParams.constructorId) || 0;
            let deleteConstructor:Partial<ConstructorModel> = {constructorId: deleteConstructorsId};
            
            console.log(deleteConstructorsId);

            // ckeck if deleteConstructorsId is > 0
            if (deleteConstructorsId > 0) {
                // find constructorId in database
                let foundConstructror = listConstructors.filter(
                    (itemConstructor)=> {
                        if (itemConstructor.constructorId === deleteConstructorsId) {
                            deleteConstructor = itemConstructor;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if constructor match
                if (foundConstructror.length > 0) {              
                    
                    const newListConstructors = listConstructors.filter(
                        (itemConstuctorStanding)=> itemConstuctorStanding.constructorId !== deleteConstructor.constructorId);
                                                    
                    // save new data to json file
                    await saveExtConstructorsToJsonFile(pathConstructorsDataJson, newListConstructors);
                    await loadConstructorsJsonFile(pathConstructorsDataJson);

                    foundConstructror = listConstructors.filter(
                        (itemConstructor)=> {
                            if (itemConstructor.constructorId === deleteConstructor.constructorId) {
                                console.log('Constructor found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundConstructror.length === 0) {
                        console.log("Constructor deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[constructorId: ${deleteConstructor.constructorId}] deleted!`,
                            "deleteConstructor": deleteConstructor};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[constructorId: ${deleteConstructor.constructorId}] wasn't deleted!`,
                            "deleteConstructor": deleteConstructor};                        
                    }
                } else {
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[constructorId: ${deleteConstructor.constructorId}] wasn't found!`,
                        "deleteConstructor": deleteConstructor};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[constructorId: ${deleteConstructor.constructorId}] must be a positive number!`};                
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
function loadConstructorJsonFile(pathCircuitsDataJson: any) {
    throw new Error("Function not implemented.");
}

