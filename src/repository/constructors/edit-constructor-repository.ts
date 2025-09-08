import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorModel } from "../../models/data/constructor";
import { isPartialConstructorModel } from "../../utils/isType/constructor-model/is-partial-constructormodel-type";
import { listConstructors, loadConstructorsJsonFile, pathConstructorsDataJson, saveExtConstructorsToJsonFile, sortListConstructors } from "./load-constructor-repository";


// PATCH - Edit a constructor
export const repositoryEditConstructor = async (
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
                // check for editConstructor key in data body
                let foundKeyeditConstructor = false;
                for (const key in reqBody) {
                    if (key === "editConstructor")
                        foundKeyeditConstructor = true;
                }
                // proceed if the editConstructor object was found
                if (foundKeyeditConstructor) {
                    // obtain data from editConstructor object
                    let editConstructor = reqBody['editConstructor'] as ConstructorModel; 
                    console.log(editConstructor);
                    // check the data format partially match with ConstructorModel
                    if (await isPartialConstructorModel(editConstructor)) { 

                        // find constructorId in database
                        if (editConstructor.constructorId > 0) {
                            // checking if the constructor is aready registered
                            let itemMatch = false;
                            listConstructors.forEach(itemConstructor => {
                                if (itemConstructor.constructorId === editConstructor.constructorId) {
                                    // edit partially constructor properties
                                    for (let key in editConstructor) {
                                        itemConstructor[key as keyof object] = editConstructor[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if standings don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Constructor Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListConstructors();
                            // save insert/edit data to json file
                            await saveExtConstructorsToJsonFile(pathConstructorsDataJson, listConstructors);
                            await loadConstructorsJsonFile(pathConstructorsDataJson);       
                            
                            // find for inserted/edited constructor
                            let foundConstructor = listConstructors.filter(
                                (itemConstructor)=> {
                                    if (itemConstructor.constructorId === editConstructor.constructorId) {
                                        console.log('Constructor Standing found!');
                                        // load all data
                                        editConstructor = itemConstructor;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundConstructor.length === 0) {
                                    console.log("Constructor wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[constructorId: ${editConstructor.constructorId}] wasn't edited!`,
                                        "editConstructor": editConstructor};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[constructorId: ${editConstructor.constructorId}] edited!`,
                                        "upsertConstructor": editConstructor};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorId: ${editConstructor.constructorId}] must be a positive number!`,
                                "editConstructor": editConstructor};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor data to be edited!"}              
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
