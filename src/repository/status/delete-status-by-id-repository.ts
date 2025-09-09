import { FastifyReply, FastifyRequest } from "fastify";
import { StatusParams } from "../../models/params/status-params-model";
import { StatusModel } from "../../models/data/status-model";
import { listStatus, loadStatusJsonFile, pathStatusDataJson, saveExtStatusToJsonFile } from "./load-status-repository";

// DELETE - Delete a status
export const repositoryDeleteStatusById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteStatusId from params
            const statusParams = request.params as StatusParams;
            const deleteStatusId = parseInt(statusParams.statusId) || 0;
            let deleteStatus:Partial<StatusModel> = {statusId: deleteStatusId};
            
            console.log(deleteStatusId);

            // ckeck if deleteStatusId is > 0
            if (deleteStatusId > 0) {
                // find statusId in database
                let foundStatus = listStatus.filter(
                    (itemStatus)=> {
                        if (itemStatus.statusId === deleteStatusId) {
                            deleteStatus = itemStatus;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if results match
                if (foundStatus.length > 0) {              
                    
                    const newListStatuss = listStatus.filter(
                        (itemStatus)=> itemStatus.statusId !== deleteStatus.statusId);
                                                    
                    // save new data to json file
                    await saveExtStatusToJsonFile(pathStatusDataJson, newListStatuss);
                    await loadStatusJsonFile(pathStatusDataJson);

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
                        response.type("application/json").code(200); // not content                                    
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
                    "message": `[statusId: ${deleteStatus.statusId}] must be a positive number!`};                
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
