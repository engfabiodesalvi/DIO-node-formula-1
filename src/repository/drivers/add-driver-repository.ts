import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/data/driver-model";
import { listDrivers, loadDriversJsonFile, pathDriversDataJson, saveDriversToJsonFile, saveExtDriversToJsonFile, sortListDrivers } from "./load-drivers-repository";
import { isDriverModel } from "../../utils/is-drivermodel-type";

// POST - Create/insert new driver
export const repositoryNewDriver = async (
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
                // check for newDriver key in data body
                let foundKeyNewDriver = false;
                for (const key in reqBody) {
                    if (key === "newDriver")
                        foundKeyNewDriver = true;            
                }
                // proceed if the newDriver object was found
                if (foundKeyNewDriver) {
                    // obtain data from newDriver object
                    let newDriver = reqBody['newDriver'] as DriverModel; 
                    // check the data format match with DriverModel
                    if (await isDriverModel(newDriver)) { 

                        // find new driver id in database
                        let findDriver = listDrivers.filter(
                            (itemDriver)=> itemDriver.driverId === newDriver.driverId);

                        // insert new item if no results match
                        if (findDriver.length === 0) {              
                            listDrivers.push(newDriver);

                            // ascendant order drivers 
                            await sortListDrivers();
                            // save new data to json file
                            await saveExtDriversToJsonFile(pathDriversDataJson, listDrivers);
                            await loadDriversJsonFile(pathDriversDataJson);      
                                        
                            //listDrivers = listDrivers.sort((a, b) => a.driverId - b.driverId);
                            // verify if new item was inserted
                            findDriver = listDrivers.filter(
                                (itemDriver)=> {
                                    if (itemDriver.driverId === newDriver.driverId) {
                                        newDriver = itemDriver;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                        
                            // if ok return the item                    
                            if (findDriver.length === 1) {
                                response.type("application/json").code(201); // created
                                return {
                                    "message": `[driverId: ${newDriver.driverId}] inserted!`, 
                                    "newDriver": findDriver};
                            } else {
                                response.type("application/json").code(500); // internal server error
                                return {
                                    "message": `[driverId: ${newDriver.driverId}] wasn't inserted!`,
                                    "newDriver": newDriver};
                            }
                        } else {
                            // driver alredy inserted.
                            response.type("application/json").code(409); // Conflict
                            return {
                                "message": `[driverId: ${newDriver.driverId}] already created!`,
                                "newDriver": newDriver};
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
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
