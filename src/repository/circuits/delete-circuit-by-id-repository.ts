import { FastifyReply, FastifyRequest } from "fastify";
import { CircuitParams } from "../../models/circuit-parameters-model";
import { CircuitModel } from "../../models/circuit-model";
import { listCircuits, loadCircuitsJsonFile, pathCircuitsDataJson, saveExtCircuitsToJsonFile } from "./load-circuits-repository";

// DELETE - Delete a driver
export const repositoryDeleteCircuitById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteCircitId from params
            const circuitParams = request.params as CircuitParams;
            const deleteCircuitId = parseInt(circuitParams.circuitId) || 0;
            let deleteCircuit:Partial<CircuitModel> = {circuitId: deleteCircuitId};
            
            console.log(deleteCircuitId);

            // ckeck if deleteCircuitId is > 0
            if (deleteCircuitId >=0) {
                // find circuitId in database
                let foundCircuit = listCircuits.filter(
                    (itemCircuit)=> {
                        if (itemCircuit.circuitId === deleteCircuitId) {
                            deleteCircuit = itemCircuit;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if results match
                if (foundCircuit.length > 0) {              
                    
                    const newListCircuits = listCircuits.filter(
                        (itemCircuits)=> itemCircuits.circuitId !== deleteCircuit.circuitId);
                                                    
                    // save new data to json file
                    await saveExtCircuitsToJsonFile(pathCircuitsDataJson, newListCircuits);
                    await loadCircuitsJsonFile(pathCircuitsDataJson);

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
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[driverId: ${deleteCircuit.circuitId}] deleted!`,
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

        //return {"message": "Bearer Token ok!", newCircuit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
