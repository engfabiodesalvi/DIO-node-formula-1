import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/driver-model";
import { listDrivers, loadDriversJsonFile, pathDataJson, saveDriversToJsonFile, saveExtDriversToJsonFile, sortListDrivers } from "./load-drivers-repository";

// POST - Create/insert new driver
export const repositoryNewDriver = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;
    const newDriver = reqBody['newDriver'] as DriverModel;
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // find new driver id in database
            let findDriver = listDrivers.filter(
                (itemDriver)=> itemDriver.driverId === newDriver.driverId);

            // insert new item if no results match
            if (findDriver.length === 0) {              
                listDrivers.push(newDriver);

                // ascendant order drivers 
                await sortListDrivers();
                // save new data to json file
                await saveExtDriversToJsonFile(pathDataJson, listDrivers);
                await loadDriversJsonFile(pathDataJson);      
                            
                //listDrivers = listDrivers.sort((a, b) => a.driverId - b.driverId);
                // verify if new item was inserted
                findDriver = listDrivers.filter(
                    (itemDriver)=> itemDriver.driverId === newDriver.driverId);
                            

                // if ok return the item                    
                if (findDriver.length === 1) {
                    response.type("application/json").code(201); // created
                    return {"newDriver": findDriver};
                } else {
                    response.type("application/json").code(500); // internal server error
                    return {"newDriver": findDriver};                    
                }
            } else {
                // driver alredy inserted.
                response.type("application/json").code(409); // Conflict
                return {
                    "message": `[driverId: ${newDriver.driverId}] já cadastrado!`,
                    "newDriver": newDriver};
            }

            //return {"message": "Bearer Token ok!", newDriver};
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
