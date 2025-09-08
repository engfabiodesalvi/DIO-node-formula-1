import { FastifyReply, FastifyRequest } from "fastify";
import { QualifyingModel } from "../../models/data/qualifying-model";
import { isQualifyingModel } from "../../utils/isType/qualifying-model/is-qualifyingModel-type";
import { listQualifyings, loadQualifyingsJsonFile, pathQualifyingsDataJson, saveExtQualifyingsToJsonFile, sortListQualifyings } from "./load-qualifyings-repository";

// PUT - (Upsert) Edit or inser new qualifying
export const repositoryUpsertQualifying = async (
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
                // check for upsertQualifying key in data body
                let foundKeyUpsertQualifying = false;
                for (const key in reqBody) {
                    if (key === "upsertQualifying")
                        foundKeyUpsertQualifying = true;
                }
                // proceed if the upsertQualifying object was found
                if (foundKeyUpsertQualifying) {
                    // obtain data from upsertQualifying object
                    let upsertQualifying = reqBody['upsertQualifying'] as QualifyingModel; 
                    // check the data format match with QualifyingModel
                    if (await isQualifyingModel(upsertQualifying)) { 

                        // find qualifyId in database
                        if (upsertQualifying.qualifyId > 0) {
                            // checking if the qualifying is aready registered
                            let itemMatch = false;
                            listQualifyings.forEach(itemQualifying => {
                                if (itemQualifying.qualifyId === upsertQualifying.qualifyId) {

                                    // edit qualifying properties

                                    itemQualifying.raceId = upsertQualifying.raceId;
                                    itemQualifying.driverId = upsertQualifying.driverId;
                                    itemQualifying.constructorId = upsertQualifying.constructorId;
                                    itemQualifying.number = upsertQualifying.number;
                                    itemQualifying.position = upsertQualifying.position;
                                    itemQualifying.q1 = upsertQualifying.q1;
                                    itemQualifying.q2 = upsertQualifying.q2;
                                    itemQualifying.q3 = upsertQualifying.q3;
                                    
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if times don't match
                            if (!itemMatch) {
                                listQualifyings.push(upsertQualifying);                
                            }

                            // ascendant order qualifyId 
                            await sortListQualifyings();
                            // save insert/edit data to json file
                            await saveExtQualifyingsToJsonFile(pathQualifyingsDataJson, listQualifyings);
                            await loadQualifyingsJsonFile(pathQualifyingsDataJson);       
                            
                            // find for inserted/edited qualifying
                            let foundQualifying = listQualifyings.filter(
                                (itemQualifying)=> {
                                    if (itemQualifying.qualifyId === upsertQualifying.qualifyId) {

                                        upsertQualifying = itemQualifying;
                                        console.log('Qualifying found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundQualifying.length === 0) {
                                    console.log("Qualifying wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[qualifyId: ${upsertQualifying.qualifyId}] wasn't inserted!`,
                                        "upsertQualifying": upsertQualifying};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[qualifyId: ${upsertQualifying.qualifyId}] edited/inserted!`,
                                        "upsertQualifying": upsertQualifying};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[qualifyId: ${upsertQualifying.qualifyId}] must be a non-zer positive number!`,
                                "upsertQualifying": upsertQualifying};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send qualifying data to be edited/inserted!"}              
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