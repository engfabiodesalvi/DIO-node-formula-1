import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorModel } from "../../models/data/constructor";
import { isPartialConstructorModel } from "../../utils/isType/constructor-model/is-partial-constructormodel-type";
import { listConstructors, loadConstructorsJsonFile, pathConstructorsDataJson, saveExtConstructorsToJsonFile } from "./load-constructor-repository";

// DELETE - Delete a constructor
export const repositoryDeleteConstructor = async (
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

                // check for deleteConstructor key in data body
                let foundKeyConstructor = false;
                for (const key in reqBody) {
                    if (key === "deleteConstructor")
                        foundKeyConstructor = true;
                }
                // proceed if the deleteConstructor object was found
                if (foundKeyConstructor) {
                    // obtain data from deleteConstructor object
                    let deleteConstructor = reqBody['deleteConstructor'] as ConstructorModel; 
                    // check the data format match parcially with ConstructorModel
                    if (await isPartialConstructorModel(deleteConstructor)) {
                        
                        // find constructorId in database
                        if (deleteConstructor.constructorId >=0) {
                            let foundConstructor = listConstructors.filter(
                                (itemConstructor)=> {
                                    if (itemConstructor.constructorId === deleteConstructor.constructorId) {
                                        deleteConstructor = itemConstructor;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if standings match
                            if (foundConstructor.length > 0) {              
                                
                                const newListConstructors = listConstructors.filter(
                                    (itemConstructor)=> itemConstructor.constructorId !== deleteConstructor.constructorId);
                                                                
                                // save new data to json file
                                await saveExtConstructorsToJsonFile(pathConstructorsDataJson, newListConstructors);
                                await loadConstructorsJsonFile(pathConstructorsDataJson);

                                // find for deleted constructor
                                foundConstructor = listConstructors.filter(
                                    (itemConstructor)=> {
                                        if (itemConstructor.constructorId === deleteConstructor.constructorId) {
                                            console.log('Constructor found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundConstructor.length === 0) {
                                    console.log("Constructor deleted");
                                    response.type("application/json").code(200); // Ok                                    
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
                                // constructor alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[constructorId: ${deleteConstructor.constructorId}] wasn't found!`,
                                    "deleteConstructor": deleteConstructor};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorId: ${deleteConstructor.constructorId}] must be a positive number!`,
                                "deleteConstructor": deleteConstructor};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructorId to be deleted!"}              
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
