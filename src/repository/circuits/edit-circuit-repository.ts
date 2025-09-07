import { FastifyReply, FastifyRequest } from "fastify";
import { CircuitModel } from "../../models/data/circuit-model";
import { isPartialCircuitModel } from "../../utils/isType/circuit-model/is-partial-circuitmodel-type";
import { listCircuits, loadCircuitsJsonFile, pathCircuitsDataJson, saveExtCircuitsToJsonFile, sortListCircuits } from "./load-circuits-repository";

// PATCH - Edit a circuit
export const repositoryEditCircuit = async (
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
                // check for editCircuit key in data body
                let foundKeyeditCircuit = false;
                for (const key in reqBody) {
                    if (key === "editCircuit")
                        foundKeyeditCircuit = true;
                }
                // proceed if the editCircuit object was found
                if (foundKeyeditCircuit) {
                    // obtain data from editCircuit object
                    let editCircuit = reqBody['editCircuit'] as CircuitModel; 
                    console.log(editCircuit);
                    // check the data format partially match with CircuitModel
                    if (await isPartialCircuitModel(editCircuit)) { 

                        // find circuitId in database
                        if (editCircuit.circuitId > 0) {
                            // checking if the circuit is aready registered
                            let itemMatch = false;
                            listCircuits.forEach(itemCircuit => {
                                if (itemCircuit.circuitId === editCircuit.circuitId) {
                                    // edit partially circuit properties
                                    for (let key in editCircuit) {
                                        itemCircuit[key as keyof object] = editCircuit[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if results don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "circuit Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListCircuits();
                            // save insert/edit data to json file
                            await saveExtCircuitsToJsonFile(pathCircuitsDataJson, listCircuits);
                            await loadCircuitsJsonFile(pathCircuitsDataJson);       
                            
                            // find for inserted/edited circuit
                            let foundCircuit = listCircuits.filter(
                                (itemCircuit)=> {
                                    if (itemCircuit.circuitId === editCircuit.circuitId) {
                                        console.log('Circuit found!');
                                        // load all data
                                        editCircuit = itemCircuit;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundCircuit.length === 0) {
                                    console.log("Circuit wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[circuitId: ${editCircuit.circuitId}] wasn't edited!`,
                                        "editCircuit": editCircuit};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[circuitId: ${editCircuit.circuitId}] edited!`,
                                        "upsertCircuit": editCircuit};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[circuitId: ${editCircuit.circuitId}] must be a positive number!`,
                                "editCircuit": editCircuit};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send circuit data to be edited!"}              
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
