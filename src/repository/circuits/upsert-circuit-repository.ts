import { FastifyReply, FastifyRequest } from "fastify";
import { CircuitModel } from "../../models/data/circuit-model";
import { isCircuitModel } from "../../utils/isType/circuit-model/is-circuitmodel-type";
import { listCircuits, loadCircuitsJsonFile, pathCircuitsDataJson, saveExtCircuitsToJsonFile, sortListCircuits } from "./load-circuits-repository";

// PUT - (Upsert) Edit or inser new circuit
export const repositoryUpsertCircuit = async (
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
                // check for upsertCircuit key in data body
                let foundKeyupsertCircuit = false;
                for (const key in reqBody) {
                    if (key === "upsertCircuit")
                        foundKeyupsertCircuit = true;
                }
                // proceed if the upsertCircuit object was found
                if (foundKeyupsertCircuit) {
                    // obtain data from upsertCircuit object
                    let upsertCircuit = reqBody['upsertCircuit'] as CircuitModel; 
                    // check the data format match with CircuitModel
                    if (await isCircuitModel(upsertCircuit)) { 

                        // find circuitId in database
                        if (upsertCircuit.circuitId > 0) {
                            // checking if the driver is aready registered
                            let itemMatch = false;
                            listCircuits.forEach(itemCircuit => {
                                if (itemCircuit.circuitId === upsertCircuit.circuitId) {
                                    // edit circuit properties
                                    itemCircuit.circuitRef = upsertCircuit.circuitRef;
                                    itemCircuit.name = upsertCircuit.name;
                                    itemCircuit.location = upsertCircuit.location;
                                    itemCircuit.country = upsertCircuit.country;
                                    itemCircuit.lat = upsertCircuit.lat;
                                    itemCircuit.lng = upsertCircuit.lng;
                                    itemCircuit.alt = upsertCircuit.alt;
                                    itemCircuit.url = upsertCircuit.url;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if results don't match
                            if (!itemMatch) {
                                listCircuits.push(upsertCircuit);                
                            }

                            // ascendant order circuitsId 
                            await sortListCircuits();
                            // save insert/edit data to json file
                            await saveExtCircuitsToJsonFile(pathCircuitsDataJson, listCircuits);
                            await loadCircuitsJsonFile(pathCircuitsDataJson);       
                            
                            // find for inserted/edited driver
                            let foundCircuit = listCircuits.filter(
                                (itemCircuit)=> {
                                    if (itemCircuit.circuitId === upsertCircuit.circuitId) {
                                        upsertCircuit = itemCircuit;
                                        console.log('Circuit found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundCircuit.length === 0) {
                                    console.log("Circuit wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[circuitId: ${upsertCircuit.circuitId}] wasn't inserted!`,
                                        "upsertCircuit": upsertCircuit};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[circuitId: ${upsertCircuit.circuitId}] edited/inserted!`,
                                        "upsertCircuit": upsertCircuit};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[circuitId: ${upsertCircuit.circuitId}] must be a positive number!`,
                                "upsertCircuit": upsertCircuit};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send circuit data to be edited/inserted!"}              
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