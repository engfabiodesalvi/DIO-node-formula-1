import { FastifyReply, FastifyRequest } from "fastify";
import { DriverModel } from "../../models/driver-model";
import { isPartialDriverModel } from "../../utils/is-partial-drivermodel-type";
import { CircuitModel } from "../../models/circuit-model";
import { isPartialCircuitModel } from "../../utils/is-partial-circuitmodel-type";
import { listCircuits, loadCircuitsJsonFile, pathCircuitsDataJson, saveExtCircuitsToJsonFile } from "./load-circuits-repository";

// DELETE - Delete a driver
export const repositoryDeleteCircuit = async (
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

                // check for deleteCircuit key in data body
                let foundKeyDeleteCircuit = false;
                for (const key in reqBody) {
                    if (key === "deleteCircuit")
                        foundKeyDeleteCircuit = true;
                }
                // proceed if the deleteCircuit object was found
                if (foundKeyDeleteCircuit) {
                    // obtain data from deleteCircuit object
                    let deleteCircuit = reqBody['deleteCircuit'] as CircuitModel; 
                    // check the data format match parcially with CircuitModel
                    if (await isPartialCircuitModel(deleteCircuit)) {
                        
                        // find circuitId in database
                        if (deleteCircuit.circuitId >=0) {
                            let foundCircuit = listCircuits.filter(
                                (itemCircuit)=> {
                                    if (itemCircuit.circuitId === deleteCircuit.circuitId) {
                                        deleteCircuit = itemCircuit;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if results match
                            if (foundCircuit.length > 0) {              
                                
                                const newListCircuits = listCircuits.filter(
                                    (itemCircuit)=> itemCircuit.circuitId !== deleteCircuit.circuitId);
                                                                
                                // save new data to json file
                                await saveExtCircuitsToJsonFile(pathCircuitsDataJson, newListCircuits);
                                await loadCircuitsJsonFile(pathCircuitsDataJson);

                                // find for deleted circuit
                                foundCircuit = listCircuits.filter(
                                    (itemCircuit)=> {
                                        if (itemCircuit.circuitId === deleteCircuit.circuitId) {
                                            console.log('Circuit found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundCircuit.length === 0) {
                                    console.log("Circuit deleted");
                                    response.type("application/json").code(200); // Ok                                    
                                    return {
                                        "message": `[circuitId: ${deleteCircuit.circuitId}] deleted!`,
                                        "deleteCircuit": deleteCircuit};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[circuitId: ${deleteCircuit.circuitId}] wasn't deleted!`,
                                        "deleteCircuit": deleteCircuit};                        
                                }
                            } else {
                                // circuit alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[circuitId: ${deleteCircuit.circuitId}] wasn't found!`,
                                    "deleteCircuit": deleteCircuit};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[circuitId: ${deleteCircuit.circuitId}] must be a positive number!`,
                                "deleteCircuit": deleteCircuit};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send circuitId to be deleted!"}              
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
}

