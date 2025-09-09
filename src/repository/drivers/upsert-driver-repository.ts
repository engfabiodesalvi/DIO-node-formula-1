import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/data/driver-model";
import { isDriverModel } from "../../utils/isType/driver-model/is-drivermodel-type";
import { listDrivers, loadDriversJsonFile, pathDriversDataJson, saveExtDriversToJsonFile, sortListDrivers } from "./load-drivers-repository";

// PUT - (Upsert) Edit or inser new driver
export const repositoryUpsertDriver = async (
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
                // check for upsertDriver key in data body
                let foundKeyUpsertDriver = false;
                for (const key in reqBody) {
                    if (key === "upsertDriver")
                        foundKeyUpsertDriver = true;
                }
                // proceed if the upsertDriver object was found
                if (foundKeyUpsertDriver) {
                    // obtain data from upsertDriver object
                    let upsertDriver = reqBody['upsertDriver'] as DriverModel; 
                    // check the data format match with DriverModel
                    if (await isDriverModel(upsertDriver)) { 

                        // checking if driveId > 0
                        if (upsertDriver.driverId > 0) {

                            // checking if the driver is aready registered in database
                            let itemMatch = false;
                            listDrivers.forEach(itemDriver => {
                                if (itemDriver.driverId === upsertDriver.driverId) {
                                    // edit driver properties
                                    itemDriver.driverRef = upsertDriver.driverRef;
                                    itemDriver.number = upsertDriver.number;
                                    itemDriver.code = upsertDriver.code;
                                    itemDriver.forename = upsertDriver.forename;
                                    itemDriver.surname = upsertDriver.surname;
                                    itemDriver.dob = upsertDriver.dob;
                                    itemDriver.nationality = upsertDriver.nationality;
                                    itemDriver.url = upsertDriver.url;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if results don't match
                            if (!itemMatch) {
                                listDrivers.push(upsertDriver);                
                            }

                            // ascendant order driversId
                            await sortListDrivers();
                            // save insert/edit data to json file
                            await saveExtDriversToJsonFile(pathDriversDataJson, listDrivers);
                            await loadDriversJsonFile(pathDriversDataJson);       
                            
                            // find for inserted/edited driver
                            let foundDriver = listDrivers.filter(
                                (itemDriver)=> {
                                    if (itemDriver.driverId === upsertDriver.driverId) {
                                        upsertDriver = itemDriver;
                                        console.log('Driver found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundDriver.length === 0) {
                                    console.log("Driver wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[driverId: ${upsertDriver.driverId}] wasn't inserted!`,
                                        "upsertDriver": upsertDriver};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[driverId: ${upsertDriver.driverId}] edited/inserted!`,
                                        "upsertDriver": upsertDriver};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[driverId: ${upsertDriver.driverId}] must be a positive number!`,
                                "upsertDriver": upsertDriver};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver data to be edited/inserted!"}              
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
