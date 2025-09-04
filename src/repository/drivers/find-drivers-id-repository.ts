import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/driver-model";
import { listDrivers } from "./load-drivers-repository";
import { DriverParams } from "../../models/driver-parameters-model";

// GET - Find driver by Id
export const repositoryFindDriverById = async (
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
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }            
};