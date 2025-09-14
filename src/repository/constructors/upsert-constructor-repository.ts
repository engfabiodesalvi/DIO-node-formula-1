import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorModel } from "../../models/data/constructor";
import { isConstructorModel } from "../../utils/isType/constructor-model/is-constructormodel-type";
import { listConstructors, loadConstructorsJsonFile, pathConstructorsDataJson, saveExtConstructorsToJsonFile, sortListConstructors } from "./load-constructor-repository";

// PUT - (Upsert) Edit or inser new constructor
export const repositoryUpsertConstructor = async (
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
                // check for upsertConstructor key in data body
                let foundKeyupsertConstructor = false;
                for (const key in reqBody) {
                    if (key === "upsertConstructor")
                        foundKeyupsertConstructor = true;
                }
                // proceed if the upsertConstructor object was found
                if (foundKeyupsertConstructor) {
                    // obtain data from upsertConstructor object
                    let upsertConstructor = reqBody['upsertConstructor'] as ConstructorModel; 
                    // check the data format match with ConstructorModel
                    if (await isConstructorModel(upsertConstructor)) { 

                        // find constructorId in database
                        if (upsertConstructor.constructorId > 0) {
                            // checking if the driver is aready registered
                            let itemMatch = false;
                            listConstructors.forEach(itemConstructor => {
                                if (itemConstructor.constructorId === upsertConstructor.constructorId) {
                                    // edit constructor properties
                                    itemConstructor.constructorRef = upsertConstructor.constructorRef;
                                    itemConstructor.name = upsertConstructor.name;
                                    itemConstructor.nationality = upsertConstructor.nationality;
                                    itemConstructor.url = upsertConstructor.url;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if constructor don't match
                            if (!itemMatch) {
                                listConstructors.push(upsertConstructor);                
                            }

                            // ascendant order constructorId 
                            await sortListConstructors();
                            // save insert/edit data to json file
                            await saveExtConstructorsToJsonFile(pathConstructorsDataJson, listConstructors);
                            await loadConstructorsJsonFile(pathConstructorsDataJson);       
                            
                            // find for inserted/edited constructor
                            let foundConstructor = listConstructors.filter(
                                (itemConstructor)=> {
                                    if (itemConstructor.constructorId === upsertConstructor.constructorId) {
                                        upsertConstructor = itemConstructor;
                                        console.log('Constructor found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundConstructor.length === 0) {
                                    console.log("Constructor wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[constructorId: ${upsertConstructor.constructorId}] wasn't inserted!`,
                                        "upsertConstructor": upsertConstructor};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {                                    
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[constructorId: ${upsertConstructor.constructorId}] edited!`,
                                            "upsertConstructor": upsertConstructor};         
                                    } else {
                                        response.type("application/json").code(201); // Create
                                        return {
                                            "message": `[constructorId: ${upsertConstructor.constructorId}] inserted!`,
                                            "upsertConstructor": upsertConstructor};                                            
                                    }               
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorId: ${upsertConstructor.constructorId}] must be a positive number!`,
                                "upsertConstructor": upsertConstructor};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor data to be edited/inserted!"}              
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