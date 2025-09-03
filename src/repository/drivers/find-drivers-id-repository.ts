import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/driver-model";
import { listDrivers } from "./load-drivers-repository";
import { DriverParams } from "../../models/driver-parameters-model";

// GET - Find driver by Id
export const repositoryFindDriverById = async (
    request: FastifyRequest,
    response: FastifyReply,      
) => {
    // partially initialized variable
    let driver:Partial<DriverModel> = {};
    if (listDrivers.length > 0) { 
        const driverParams = request.params as DriverParams;
        const driverId = parseInt(driverParams.driverId) || 0;
        driver = listDrivers.find((driverItem) => {              
            if (driverId > 0) {
                if (!(driverItem.driverId === driverId)) {
                    console.info(`${driverItem.driverId} - ${driverId}`);
                    return false;            
                } else {
                return true;
                }
            }
        }) as DriverModel;
    }

    if (!(driver)) {
        response.type("application/json").code(404);
        return { message: "Driver Not Found" };
    } else {
        response.type("application/json").code(200);
        return { "driver": driver };
    }   
};