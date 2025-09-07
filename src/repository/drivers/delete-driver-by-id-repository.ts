import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/data/driver-model";
import { listDrivers, loadDriversJsonFile, pathDriversDataJson, saveExtDriversToJsonFile } from "./load-drivers-repository";
import { DriverParams } from "../../models/params/driver-params-model";

// DELETE - Delete a driver
export const repositoryDeleteDriverById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteDriverId from params
            const driverParams = request.params as DriverParams;
            const deleteDriverId = parseInt(driverParams.driverId) || 0;
            let deleteDriver:Partial<DriverModel> = {driverId: deleteDriverId};
            
            console.log(deleteDriverId);

            // ckeck if deleteDriverId is > 0
            if (deleteDriverId > 0) {
                // find driverId in database
                let foundDriver = listDrivers.filter(
                    (itemDriver)=> {
                        if (itemDriver.driverId === deleteDriverId) {
                            deleteDriver = itemDriver;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if results match
                if (foundDriver.length > 0) {              
                    
                    const newListDrivers = listDrivers.filter(
                        (itemDriver)=> itemDriver.driverId !== deleteDriver.driverId);
                                                    
                    // save new data to json file
                    await saveExtDriversToJsonFile(pathDriversDataJson, newListDrivers);
                    await loadDriversJsonFile(pathDriversDataJson);

                    foundDriver = listDrivers.filter(
                        (itemDriver)=> {
                            if (itemDriver.driverId === deleteDriver.driverId) {
                                console.log('Driver found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundDriver.length === 0) {
                        console.log("Drever deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[driverId: ${deleteDriver.driverId}] deleted!`,
                            "deleteDriver": deleteDriver};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[driverId: ${deleteDriver.driverId}] wasn't deleted!`,
                            "deleteDriver": deleteDriver};                        
                    }
                } else {
                    // driver alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[driverId: ${deleteDriver.driverId}] wasn't found!`,
                        "deleteDriver": deleteDriver};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[driverId: ${deleteDriver.driverId}] must be a positive number!`};                
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
}