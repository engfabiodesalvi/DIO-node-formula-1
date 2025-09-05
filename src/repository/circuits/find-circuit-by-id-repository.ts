import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/driver-model";

import { DriverParams } from "../../models/driver-parameters-model";
import { CircuitModel } from "../../models/circuit-model";
import { listCircuits } from "./load-circuits-repository";
import { CircuitParams } from "../../models/circuit-parameters-model";

// GET - Find circuits by Id
export const repositoryFindCircuitById = async (
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
            let circuit:Partial<CircuitModel> = {};
            if (listCircuits.length > 0) { 
                const circuitParams = request.params as CircuitParams;
                if (circuitParams.circuitId) {
                    const circuitId = parseInt(circuitParams.circuitId) || 0;
                    if ((circuitId > 0) && Number.isInteger(parseFloat(circuitParams.circuitId) || 0)) {
                        circuit = listCircuits.find((circuitItem) => {              
                            if (circuitId > 0) {
                                if (!(circuitItem.circuitId === circuitId)) {
                                    console.info(`${circuitItem.circuitId} - ${circuitId}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as DriverModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[circuitId: ${circuitParams.circuitId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send circuitId to be find!"} 
                }
            }

            if (!(circuit)) {
                response.type("application/json").code(404);
                return { message: "Circuit Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "circuit": circuit };
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