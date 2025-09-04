import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/driver-model";
import { listDrivers, loadDriversJsonFile, pathDataJson, saveExtDriversToJsonFile } from "./load-drivers-repository";
import { isPartialDriverModel } from "../../utils/is-partial-drivermodel-type";
import { DriverParams } from "../../models/driver-parameters-model";

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
            if (deleteDriverId >=0) {
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
                    await saveExtDriversToJsonFile(pathDataJson, newListDrivers);
                    await loadDriversJsonFile(pathDataJson);

                    foundDriver = listDrivers.filter(
                        (itemDriver)=> {
                            if (itemDriver.driverId === deleteDriver.driverId) {
                                console.log('Driver encontrado!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundDriver.length === 0) {
                        console.log("item deletado");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[driverId: ${deleteDriver.driverId}] deletado!`,
                            "deleteDriver": deleteDriver};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[driverId: ${deleteDriver.driverId}] não deletado!`,
                            "deleteDriver": deleteDriver};                        
                    }
                } else {
                    // driver alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[driverId: ${deleteDriver.driverId}] não encontrado!`,
                        "deleteDriver": deleteDriver};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[driverId: ${deleteDriver.driverId}] deve ser um número positivo!`,
                    "deleteDriver": deleteDriver};                
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