

import { FastifyReply, FastifyRequest } from "fastify";
import { StatusModel } from "../../models/data/status-model";
import { isPartialStatusModel } from "../../utils/isType/status-model/is-partial-statusModel-type";
import { listStatus, loadStatusJsonFile, pathStatusDataJson, saveExtStatusToJsonFile, sortListStatus } from "./load-status-repository";

// PATCH - Edit a status
export const repositoryEditStatus = async (
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
                // check for editStatus key in data body
                let foundKeyEditStatus = false;
                for (const key in reqBody) {
                    if (key === "editStatus")
                        foundKeyEditStatus = true;
                }
                // proceed if the editStatus object was found
                if (foundKeyEditStatus) {
                    // obtain data from editStatus object
                    let editStatus = reqBody['editStatus'] as StatusModel; 
                    console.log(editStatus);
                    // check the data format partially match with StatusModel
                    if (await isPartialStatusModel(editStatus)) { 

                        // find statusId in database
                        if (editStatus.statusId > 0) {
                            // checking if the status is aready registered
                            let itemMatch = false;
                            listStatus.forEach(itemStatus => {
                                if (itemStatus.statusId === editStatus.statusId) {
                                    // edit partially status properties
                                    for (let key in editStatus) {
                                        itemStatus[key as keyof object] = editStatus[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if results don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Status Not Found" };                                                
                            }

                            // ascendant order status 
                            await sortListStatus();
                            // save insert/edit data to json file
                            await saveExtStatusToJsonFile(pathStatusDataJson, listStatus);
                            await loadStatusJsonFile(pathStatusDataJson);       
                            
                            // find for inserted/edited status
                            let foundStatus = listStatus.filter(
                                (itemStatus)=> {
                                    if (itemStatus.statusId === editStatus.statusId) {
                                        console.log('Status found!');
                                        // load all data
                                        editStatus = itemStatus;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundStatus.length === 0) {
                                    console.log("Status wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[statusId: ${editStatus.statusId}] wasn't edited!`,
                                        "editStatus": editStatus};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[statusId: ${editStatus.statusId}] edited!`,
                                        "edittStatus": editStatus};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[statusId: ${editStatus.statusId}] must be a positive number!`,
                                "editStatus": editStatus};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send status data to be edited!"}              
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
