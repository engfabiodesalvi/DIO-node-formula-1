
import { FastifyReply, FastifyRequest } from "fastify";
import { listStatus, loadStatusJsonFile, pathStatusDataJson, saveExtStatusToJsonFile } from "./load-status-repository";
import { StatusModel } from "../../models/data/status-model";
import { isPartialStatusModel } from "../../utils/isType/status-model/is-partial-statusModel-type";

// DELETE - Delete a status
export const repositoryDeleteStatus = async (
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

                // check for deleteStatus key in data body
                let foundKeyDeleteStatus = false;
                for (const key in reqBody) {
                    if (key === "deleteStatus")
                        foundKeyDeleteStatus = true;
                }
                // proceed if the deleteStatus object was found
                if (foundKeyDeleteStatus) {
                    // obtain data from deleteStatus object
                    let deleteStatus = reqBody['deleteStatus'] as StatusModel; 
                    // check the data format match parcially with StatusModel
                    if (await isPartialStatusModel(deleteStatus)) {
                        
                        // find statusId in database
                        if (deleteStatus.statusId > 0) {
                            let foundStatus = listStatus.filter(
                                (itemStatus)=> {
                                    if (itemStatus.statusId === deleteStatus.statusId) {
                                        deleteStatus = itemStatus;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if results match
                            if (foundStatus.length > 0) {              
                                
                                const newListStatus = listStatus.filter(
                                    (itemStatus)=> itemStatus.statusId !== deleteStatus.statusId);
                                                                
                                // save new data to json file
                                await saveExtStatusToJsonFile(pathStatusDataJson, newListStatus);
                                await loadStatusJsonFile(pathStatusDataJson);

                                // find for deleted status
                                foundStatus = listStatus.filter(
                                    (itemStatus)=> {
                                        if (itemStatus.statusId === deleteStatus.statusId) {
                                            console.log('Status found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundStatus.length === 0) {
                                    console.log("Status deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[statusId: ${deleteStatus.statusId}] deleted!`,
                                        "deleteStatus": deleteStatus};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[statusId: ${deleteStatus.statusId}] wasn't deleted!`,
                                        "deleteStatus": deleteStatus};                        
                                }
                            } else {
                                // status alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[statusId: ${deleteStatus.statusId}] wasn't found!`,
                                    "deleteStatus": deleteStatus};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[statusId: ${deleteStatus.statusId}] must be a non-zero positive number!`,
                                "deleteStatus": deleteStatus};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send statusId to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newStatus};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}