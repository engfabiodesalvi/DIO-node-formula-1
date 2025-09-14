import { FastifyReply, FastifyRequest } from "fastify";
import { StatusModel } from "../../models/data/status-model";
import { isStatusModel } from "../../utils/isType/status-model/is-statusModel-type";
import { listStatus, loadStatusJsonFile, pathStatusDataJson, saveExtStatusToJsonFile, sortListStatus } from "./load-status-repository";

// PUT - (Upsert) Edit or inser new status
export const repositoryUpsertStatus = async (
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
                // check for upsertStatus key in data body
                let foundKeyUpsertStatus = false;
                for (const key in reqBody) {
                    if (key === "upsertStatus")
                        foundKeyUpsertStatus = true;
                }
                // proceed if the upsertStatus object was found
                if (foundKeyUpsertStatus) {
                    // obtain data from upsertStatus object
                    let upsertStatus = reqBody['upsertStatus'] as StatusModel; 
                    // check the data format match with StatusModel
                    if (await isStatusModel(upsertStatus)) { 

                        // checking if statusId > 0
                        if (upsertStatus.statusId > 0) {

                            // checking if the status is aready registered in database
                            let itemMatch = false;
                            listStatus.forEach(itemStatus => {
                                if (itemStatus.statusId === upsertStatus.statusId) {
                                    // edit status properties
                                    itemStatus.status = upsertStatus.status;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if results don't match
                            if (!itemMatch) {
                                listStatus.push(upsertStatus);                
                            }

                            // ascendant order statusId
                            await sortListStatus();
                            // save insert/edit data to json file
                            await saveExtStatusToJsonFile(pathStatusDataJson, listStatus);
                            await loadStatusJsonFile(pathStatusDataJson);       
                            
                            // find for inserted/edited status
                            let foundStatus = listStatus.filter(
                                (itemStatus)=> {
                                    if (itemStatus.statusId === upsertStatus.statusId) {
                                        upsertStatus = itemStatus;
                                        console.log('Status found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundStatus.length === 0) {
                                    console.log("Status wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[statusId: ${upsertStatus.statusId}] wasn't inserted!`,
                                        "upsertStatus": upsertStatus};
                                } else {
                                    // itemMatch = true => Edited
                                    // itemMatch = false => Added
                                    if (itemMatch) {          
                                        response.type("application/json").code(200); // Ok
                                        return {
                                            "message": `[statusId: ${upsertStatus.statusId}] edited!`,
                                            "upsertStatus": upsertStatus};                                       
                                    } else {              
                                        response.type("application/json").code(201); // Create
                                        return {
                                            "message": `[statusId: ${upsertStatus.statusId}] inserted!`,
                                            "upsertStatus": upsertStatus};                                                     
                                    }                
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[statusId: ${upsertStatus.statusId}] must be a positive number!`,
                                "upsertStatus": upsertStatus};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send status data to be edited/inserted!"}              
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