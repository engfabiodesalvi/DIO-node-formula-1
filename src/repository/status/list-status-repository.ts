import { FastifyReply, FastifyRequest } from "fastify";
import { listStatus } from "./load-status-repository";


// GET - List all status and Find status using query parameters
export const repositoryListStatus = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the status values
            const { 
                statusId, status
            } = request.query as any;

            // To verify sended values
            // console.log(JSON.stringify({
            //    statusId, url
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            //console.log(JSON.stringify(request.body, null, 2)); 

            //console.log(`${typeof(statusId) === 'string'}`)
            //console.log(`${Number.isInteger(parseFloat(statusId))} - ${statusId}`);

            const statusFilter = listStatus.filter((statusItem) => {
                let allMatch = true;
                    
                // Comparing values
                if (statusId) {
                    if (!(statusItem.statusId === parseInt(statusId)) ||                
                        !((parseInt(statusId) > 0)) ||
                        !(Number.isInteger(parseFloat(statusId)))) {
                        allMatch = false;
                    }
                }
                
                if (status?.length > 0) {
                    if(!(statusItem.status.toLowerCase()
                        .includes(status.toLowerCase()))) {
                        allMatch = false;
                    }
                }           

                return allMatch;
            });

            if (!(statusFilter.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Status Not Found" };
            } else {
                response.type("application/json").code(200);
                return { statusFilter };
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