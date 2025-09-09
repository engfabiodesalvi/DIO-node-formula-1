
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusModel } from "../../models/data/status-model";
import { isStatusModel } from "../../utils/isType/status-model/is-statusModel-type";
import { listStatus, loadStatusJsonFile, pathStatusDataJson, saveExtStatusToJsonFile, sortListStatus } from "./load-status-repository";

// POST - Create/insert new status
export const repositoryNewStatus = async (
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
                // check for newStatus key in data body
                let foundKeyNewStatus = false;
                for (const key in reqBody) {
                    if (key === "newStatus")
                        foundKeyNewStatus = true;            
                }
                // proceed if the newStatus object was found
                if (foundKeyNewStatus) {
                    // obtain data from newStatus object
                    let newStatus = reqBody['newStatus'] as StatusModel; 
                    // check the data format match with StatusModel
                    if (await isStatusModel(newStatus)) { 

                        // checking if statusId > 0                                                
                        if (newStatus.statusId > 0) {

                            // find new status id in database
                            let findStatus = listStatus.filter(
                                (itemStatus)=> itemStatus.statusId === newStatus.statusId);

                            // insert new item if no results match
                            if (findStatus.length === 0) {              
                                listStatus.push(newStatus);

                                // ascendant order statuss 
                                await sortListStatus();
                                // save new data to json file
                                await saveExtStatusToJsonFile(pathStatusDataJson, listStatus);
                                await loadStatusJsonFile(pathStatusDataJson);      
                                            
                                //listStatus = listStatus.sort((a, b) => a.statusId - b.statusId);
                                // verify if new item was inserted
                                findStatus = listStatus.filter(
                                    (itemStatus)=> {
                                        if (itemStatus.statusId === newStatus.statusId) {
                                            newStatus = itemStatus;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findStatus.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[statusId: ${newStatus.statusId}] inserted!`, 
                                        "newStatus": findStatus};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[statusId: ${newStatus.statusId}] wasn't inserted!`,
                                        "newStatus": newStatus};
                                }
                            } else {
                                // status alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[statusId: ${newStatus.statusId}] already created!`,
                                    "newStatus": newStatus};
                            }

                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[statusId: ${newStatus.statusId}] must be a positive number!`,
                                "newStatus": newStatus};                                  
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send status data to be inserted!"}
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


    //return request.headers.authorization;
}
