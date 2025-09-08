import { FastifyReply, FastifyRequest } from "fastify";
import { QualifyingModel } from "../../models/data/qualifying-model";
import { isPartialQualifyingModel } from "../../utils/isType/qualifying-model/is-partial-qualifyingModel-type";
import { listQualifyings, loadQualifyingsJsonFile, pathQualifyingsDataJson, saveExtQualifyingsToJsonFile, sortListQualifyings } from "./load-qualifyings-repository";

// PATCH - Edit a qualifying
export const repositoryEditQualifying = async (
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
                // check for editQualifying key in data body
                let foundKeyQualifying = false;
                for (const key in reqBody) {
                    if (key === "editQualifying")
                        foundKeyQualifying = true;
                }
                // proceed if the editQualifying object was found
                if (foundKeyQualifying) {
                    // obtain data from editQualifying object
                    let editQualifying = reqBody['editQualifying'] as QualifyingModel; 
                    console.log(editQualifying);
                    // check the data format partially match with QualifyingModel
                    if (await isPartialQualifyingModel(editQualifying)) { 

                        // find pitStopId qualifyId database
                        if (editQualifying.qualifyId > 0) {
                            // checking if the qualifying is aready registered
                            let itemMatch = false;
                            listQualifyings.forEach((itemQualifying) => {
                                if (itemQualifying.qualifyId === editQualifying.qualifyId) {
                                        // edit partially qualifying properties
                                        for (let key in editQualifying) {
                                            itemQualifying[key as keyof object] = editQualifying[key as keyof object];
                                        }
                                        itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if stops don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Qualifying Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListQualifyings();
                            // save insert/edit data to json file
                            await saveExtQualifyingsToJsonFile(pathQualifyingsDataJson, listQualifyings);
                            await loadQualifyingsJsonFile(pathQualifyingsDataJson);       
                            
                            // find for inserted/edited qualifying
                            let foundQualifying = listQualifyings.filter(
                                (itemQualifying)=> {
                                if (itemQualifying.qualifyId === editQualifying.qualifyId) {
                                        console.log('Qualifying found!');
                                        // load all data
                                        editQualifying = itemQualifying;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundQualifying.length === 0) {
                                    console.log("Qualifying wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[qualifyId: ${editQualifying.qualifyId}] wasn't edited!`,
                                        "editQualifying": editQualifying};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[qualifyId: ${editQualifying.qualifyId}] edited!`,
                                        "upsertQualifying": editQualifying};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[qualifyId: ${editQualifying.qualifyId}] must be a positive number!`,
                                "editQualifying": editQualifying};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send qualifying data to be edited!"}              
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
