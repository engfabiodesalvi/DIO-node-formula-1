
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusModel } from "../../models/data/status-model";
import { listStatus } from "./load-status-repository";
import { StatusParams } from "../../models/params/status-params-model";

// GET - Find status by Id
export const repositoryFindStatusById = async (
    request: FastifyRequest,
    response: FastifyReply,      
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // partially initialized variable
            let status:Partial<StatusModel> = {};
            if (listStatus.length > 0) { 
                const statusParams = request.params as StatusParams;
                if (statusParams.statusId) {
                    const statusId = parseInt(statusParams.statusId) || 0;
                    if ((statusId > 0) && Number.isInteger(parseFloat(statusParams.statusId) || 0)) {
                        status = listStatus.find((statusItem) => {              
                            if (statusId > 0) {
                                if (!(statusItem.statusId === statusId)) {
                                    console.info(`${statusItem.statusId} - ${statusId}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as StatusModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[statusId: ${statusParams.statusId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send statusId to be find!"} 
                }
            }

            if (!(status)) {
                response.type("application/json").code(404);
                return { message: "Status Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "status": status };
            }   
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }            
};