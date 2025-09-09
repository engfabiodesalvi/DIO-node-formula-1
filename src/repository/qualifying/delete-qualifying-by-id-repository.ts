import { FastifyReply, FastifyRequest } from "fastify";
import { listQualifyings, loadQualifyingsJsonFile, pathQualifyingsDataJson, saveExtQualifyingsToJsonFile } from "./load-qualifyings-repository";
import { QualifyingParams } from "../../models/params/qualifying-params-model";
import { QualifyingModel } from "../../models/data/qualifying-model";

// DELETE - Delete a qualifying
export const repositoryDeleteQualifyingById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteQualifyId from params
            const qualifyingParams = request.params as QualifyingParams;
            const deleteQualifyId = parseInt(qualifyingParams.qualifyId) || 0;
            let deleteQualifying:Partial<QualifyingModel> = {
                qualifyId: deleteQualifyId
            };
            
            console.log(`${deleteQualifyId} `);

            // ckeck if deleteQualifyId > 0 
            if (deleteQualifyId > 0 ) {
                // find qualifyId in database
                let foundQualifying = listQualifyings.filter(
                    (itemQualifying)=> {
                        if (itemQualifying.qualifyId === deleteQualifyId) {

                            deleteQualifying = itemQualifying;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if qualifying match
                if (foundQualifying.length > 0) {              
                    
                    const newListQualifyings = listQualifyings.filter(
                        (itemQualifying)=> !(itemQualifying.qualifyId === deleteQualifying.qualifyId));
                                                    
                    // save new data to json file
                    await saveExtQualifyingsToJsonFile(pathQualifyingsDataJson, newListQualifyings);
                    await loadQualifyingsJsonFile(pathQualifyingsDataJson);

                    foundQualifying = listQualifyings.filter(
                        (itemQualifying)=> {
                        if (itemQualifying.qualifyId === deleteQualifyId) {
                                console.log('Qualifying found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundQualifying.length === 0) {
                        console.log("Qualifying deleted");
                        response.type("application/json").code(200); // not content                                    
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
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[qualifyId: ${deleteQualifying.qualifyId}] wasn't found!`,
                        "deleteQualifying": deleteQualifying};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[qualifyId: ${deleteQualifying.qualifyId}] must be a non-zero positive number!`};                
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


