import { FastifyReply, FastifyRequest } from "fastify";
import { CircuitModel } from "../../models/data/circuit-model";
import { isCircuitModel } from "../../utils/is-circuitmodel-type";
import { listCircuits, loadCircuitsJsonFile, pathCircuitsDataJson, saveExtCircuitsToJsonFile, sortListCircuits } from "./load-circuits-repository";

// POST - Create/insert new circuit
export const repositoryNewCircuit = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // ckeck if reqBody is defined
            if (reqBody) {            
                // check for newCircuit key in data body
                let foundKeyNewCircuit = false;
                for (const key in reqBody) {
                    if (key === "newCircuit")
                        foundKeyNewCircuit = true;            
                }
                // proceed if the newCircuit object was found
                if (foundKeyNewCircuit) {
                    // obtain data from newCircuit object
                    let newCircuit = reqBody['newCircuit'] as CircuitModel; 
                    // check the data format match with CircuitModel
                    if (await isCircuitModel(newCircuit)) { 

                        // find new driver id in database
                        let findCircuit = listCircuits.filter(
                            (itemCircuit)=> itemCircuit.circuitId === newCircuit.circuitId);

                        // insert new item if no results match
                        if (findCircuit.length === 0) {              
                            listCircuits.push(newCircuit);

                            // ascendant order drivers 
                            await sortListCircuits();
                            // save new data to json file
                            await saveExtCircuitsToJsonFile(pathCircuitsDataJson, listCircuits);
                            await loadCircuitsJsonFile(pathCircuitsDataJson);      
                                        
                            //listCircuits = listCircuits.sort((a, b) => a.circuitId - b.circuitId);
                            // verify if new item was inserted
                            findCircuit = listCircuits.filter(
                                (itemCircuit)=> {
                                    if (itemCircuit.circuitId === newCircuit.circuitId) {
                                        newCircuit = itemCircuit;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                        
                            // if ok return the item                    
                            if (findCircuit.length === 1) {
                                response.type("application/json").code(201); // created
                                return {
                                    "message": `[circuitId: ${newCircuit.circuitId}] inserted!`, 
                                    "newCircuit": findCircuit};
                            } else {
                                response.type("application/json").code(500); // internal server error
                                return {
                                    "message": `[circuitId: ${newCircuit.circuitId}] wasn't inserted!`,
                                    "newCircuit": newCircuit};
                            }
                        } else {
                            // driver alredy inserted.
                            response.type("application/json").code(409); // Conflict
                            return {
                                "message": `[circuitId: ${newCircuit.circuitId}] already created!`,
                                "newCircuit": newCircuit};
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
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


    //return request.headers.authorization;
}
