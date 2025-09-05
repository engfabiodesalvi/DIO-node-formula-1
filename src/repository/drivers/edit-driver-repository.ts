import { FastifyReply, FastifyRequest } from "fastify";
import { listDrivers, loadDriversJsonFile, pathDataJson, saveExtDriversToJsonFile, sortListDrivers } from "./load-drivers-repository";
import { DriverModel } from "../../models/driver-model";
import { isDriverModel } from "../../utils/is-drivermodel-type";
import { isPartialDriverModel } from "../../utils/is-partial-drivermodel-type";

// PATCH - Edit a driver
export const repositoryEditDriver = async (
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
                // check for editDriver key in data body
                let foundKeyEditDriver = false;
                for (const key in reqBody) {
                    if (key === "editDriver")
                        foundKeyEditDriver = true;
                }
                // proceed if the editDriver object was found
                if (foundKeyEditDriver) {
                    // obtain data from editDriver object
                    let editDriver = reqBody['editDriver'] as DriverModel; 
                    console.log(editDriver);
                    // check the data format partially match with DriverModel
                    if (await isPartialDriverModel(editDriver)) { 

                        // find driverId in database
                        if (editDriver.driverId > 0) {
                            // checking if the driver is aready registered
                            let itemMatch = false;
                            listDrivers.forEach(itemDriver => {
                                if (itemDriver.driverId === editDriver.driverId) {
                                    // edit partially driver properties
                                    for (let key in editDriver) {
                                        itemDriver[key as keyof object] = editDriver[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if results don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Driver Not Found" };                                                
                            }

                            // ascendant order drivers 
                            await sortListDrivers();
                            // save insert/edit data to json file
                            await saveExtDriversToJsonFile(pathDataJson, listDrivers);
                            await loadDriversJsonFile(pathDataJson);       
                            
                            // find for inserted/edited driver
                            let foundDriver = listDrivers.filter(
                                (itemDriver)=> {
                                    if (itemDriver.driverId === editDriver.driverId) {
                                        console.log('Driver found!');
                                        // load all data
                                        editDriver = itemDriver;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundDriver.length === 0) {
                                    console.log("Driver wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[driverId: ${editDriver.driverId}] wasn't edited!`,
                                        "editDriver": editDriver};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[driverId: ${editDriver.driverId}] edited!`,
                                        "upsertDriver": editDriver};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[driverId: ${editDriver.driverId}] must be a positive number!`,
                                "editDriver": editDriver};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver data to be edited!"}              
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
