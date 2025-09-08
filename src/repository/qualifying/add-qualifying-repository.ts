import { FastifyReply, FastifyRequest } from "fastify";
import { QualifyingModel } from "../../models/data/qualifying-model";
import { isQualifyingModel } from "../../utils/isType/qualifying-model/is-qualifyingModel-type";
import { listQualifyings, loadQualifyingsJsonFile, pathQualifyingsDataJson, saveExtQualifyingsToJsonFile, sortListQualifyings } from "./load-qualifyings-repository";

// POST - Create/insert new qualifying
export const repositoryNewQualifying = async (
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
                // check for newQualifying key in data body
                let foundKeyNewQualifying = false;
                for (const key in reqBody) {
                    if (key === "newQualifying")
                        foundKeyNewQualifying = true;            
                }
                // proceed if the newQualifying object was found
                if (foundKeyNewQualifying) {
                    // obtain data from newQualifying object
                    let newQualifying = reqBody['newQualifying'] as QualifyingModel; 
                    // check the data format match with QualifyingModel
                    if (await isQualifyingModel(newQualifying)) { 

                        // checking if qualifyId > 0
                        if (newQualifying.qualifyId > 0) {

                            // find new qualifying qualifyId in database
                            let findQualifying = listQualifyings.filter(
                                (itemQualifying) => itemQualifying.qualifyId === newQualifying.qualifyId);
                                

                            // insert new item if no stops match
                            if (findQualifying.length === 0) {              
                                listQualifyings.push(newQualifying);

                                // ascendant order qualifyings 
                                await sortListQualifyings();
                                // save new data to json file
                                await saveExtQualifyingsToJsonFile(pathQualifyingsDataJson, listQualifyings);
                                await loadQualifyingsJsonFile(pathQualifyingsDataJson);      
                                            
                                //listQualifyings = listQualifyings.sort((a, b) => a.qualifyId - b.qualifyId);
                                // verify if new item was inserted
                                findQualifying = listQualifyings.filter(
                                    (itemQualifying)=> {
                                        if (itemQualifying.qualifyId === newQualifying.qualifyId) {

                                            newQualifying = itemQualifying;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findQualifying.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[qualifyId: ${newQualifying.qualifyId}] inserted!`, 
                                        "newQualifying": findQualifying};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[qualifyId: ${newQualifying.qualifyId}] wasn't inserted!`,
                                        "newQualifying": newQualifying};
                                }
                            } else {
                                // qualifying alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[qualifyId: ${newQualifying.qualifyId}] already created!`,
                                    "newQualifying": newQualifying};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[qualifyId: ${newQualifying.qualifyId}] must be a positive number!`,
                                "newQualifying": newQualifying};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send qualifying data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newQualifying};
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
