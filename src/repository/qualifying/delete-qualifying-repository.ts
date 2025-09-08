import { FastifyReply, FastifyRequest } from "fastify";
import { QualifyingModel } from "../../models/data/qualifying-model";
import { isPartialQualifyingModel } from "../../utils/isType/qualifying-model/is-partial-qualifyingModel-type";
import { listQualifyings, loadQualifyingsJsonFile, pathQualifyingsDataJson, saveExtQualifyingsToJsonFile } from "./load-qualifyings-repository";

// DELETE - Delete a qualifying
export const repositoryDeleteQualifying = async (
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

                // check for deleteQualifying key in data body
                let foundKeyQualifying = false;
                for (const key in reqBody) {
                    if (key === "deleteQualifying")
                        foundKeyQualifying = true;
                }
                // proceed if the deleteQualifying object was found
                if (foundKeyQualifying) {
                    // obtain data from deleteQualifying object
                    let deleteQualifying = reqBody['deleteQualifying'] as QualifyingModel; 
                    // check the data format match parcially with QualifyingModel
                    if (await isPartialQualifyingModel(deleteQualifying)) {
                        
                        // find qualifyId
                        if (deleteQualifying.qualifyId > 0) {
                            let foundQualifying = listQualifyings.filter(
                                (itemQualifying)=> {
                                    if (itemQualifying.qualifyId === deleteQualifying.qualifyId) {

                                        deleteQualifying = itemQualifying;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if stops match
                            if (foundQualifying.length > 0) {              
                                
                                const newListQualifyings = listQualifyings.filter(
                                    (itemQualifying)=> !(itemQualifying.qualifyId === deleteQualifying.qualifyId));
                                                                
                                // save new data to json file
                                await saveExtQualifyingsToJsonFile(pathQualifyingsDataJson, newListQualifyings);
                                await loadQualifyingsJsonFile(pathQualifyingsDataJson);

                                // find for deleted qualifying
                                foundQualifying = listQualifyings.filter(
                                    (itemQualifying)=> {
                                        if (itemQualifying.qualifyId === deleteQualifying.qualifyId) {

                                            console.log('Qualifying found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundQualifying.length === 0) {
                                    console.log("Qualifying deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[qualifyId: ${deleteQualifying.qualifyId}] deleted!`,
                                        "deleteQualifying": deleteQualifying};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[qualifyId: ${deleteQualifying.qualifyId}] wasn't deleted!`,
                                        "deleteQualifying": deleteQualifying};                        
                                }
                            } else {
                                // qualifying alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[qualifyId: ${deleteQualifying.qualifyId}] wasn't found!`,
                                    "deleteQualifying": deleteQualifying};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[qualifyId: ${deleteQualifying.qualifyId}] must be a non-zero positive number!`,
                                "deleteQualifying": deleteQualifying};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send qualifyId to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newPit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
