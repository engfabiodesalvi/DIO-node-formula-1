import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorModel } from "../../models/data/constructor";
import { isConstructorModel } from "../../utils/isType/constructor-model/is-constructormodel-type";
import { listConstructors, loadConstructorsJsonFile, pathConstructorsDataJson, saveExtConstructorsToJsonFile, sortListConstructors } from "./load-constructor-repository";

// POST - Create/insert new constructor
export const repositoryNewConstructor = async (
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
                // check for newConstructor key in data body
                let foundKeyNewConstructor = false;
                for (const key in reqBody) {
                    if (key === "newConstructor")
                        foundKeyNewConstructor = true;            
                }
                // proceed if the newConstructor object was found
                if (foundKeyNewConstructor) {
                    // obtain data from newConstructor object
                    let newConstructor = reqBody['newConstructor'] as ConstructorModel; 
                    // check the data format match with ConstructorModel
                    if (await isConstructorModel(newConstructor)) { 

                        // checking if constructorId > 0
                        if (newConstructor.constructorId > 0) {

                            // find new constructor id in database
                            let findConstructor = listConstructors.filter(
                                (itemConstructor)=> itemConstructor.constructorId === newConstructor.constructorId);

                            // insert new item if no standings match
                            if (findConstructor.length === 0) {              
                                listConstructors.push(newConstructor);

                                // ascendant order constructors 
                                await sortListConstructors();
                                // save new data to json file
                                await saveExtConstructorsToJsonFile(pathConstructorsDataJson, listConstructors);
                                await loadConstructorsJsonFile(pathConstructorsDataJson);      
                                            
                                //listConstructors = listConstructors.sort((a, b) => a.constructorId - b.constructorId);
                                // verify if new item was inserted
                                findConstructor = listConstructors.filter(
                                    (itemConstructor)=> {
                                        if (itemConstructor.constructorId === newConstructor.constructorId) {
                                            newConstructor = itemConstructor;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findConstructor.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[constructorId: ${newConstructor.constructorId}] inserted!`, 
                                        "newConstructor": findConstructor};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[constructorId: ${newConstructor.constructorId}] wasn't inserted!`,
                                        "newConstructor": newConstructor};
                                }
                            } else {
                                // constructor alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[constructorId: ${newConstructor.constructorId}] already created!`,
                                    "newConstructor": newConstructor};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorId: ${newConstructor.constructorId}] must be a positive number!`,
                                "newConstructor": newConstructor};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newConstructor};
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
