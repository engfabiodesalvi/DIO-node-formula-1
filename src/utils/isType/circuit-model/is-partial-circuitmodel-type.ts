import { CircuitModel } from "../../../models/data/circuit-model";

export const isPartialCircuitModel = async (
  circuitModel?: CircuitModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfCircuitModel = false;
    let countKeys = Object.keys(circuitModel as CircuitModel).length

    // CircuitModel must have a defined circuitId
    if (!Array.isArray(circuitModel) &&
            circuitModel !== undefined &&
            typeof circuitModel.circuitId === 'number' &&
            Number.isInteger(circuitModel.circuitId)) {
            
        countKeys--; // typeof circuitModel.circuitId === 'number')

        if (typeof circuitModel.circuitRef === 'string')
            countKeys--;

        if (typeof circuitModel.name === 'string')
            countKeys--;

        if (typeof circuitModel.location === 'string')
            countKeys--;

        if (typeof circuitModel.country === 'string')
            countKeys--;

        if (typeof circuitModel.lat === 'number' && 
            Number.isFinite(circuitModel.lat))
            countKeys--;                 

        if (typeof circuitModel.lng === 'number' && 
            Number.isFinite(circuitModel.lng))
            countKeys--;  
            
        if (typeof circuitModel.alt === 'number' && 
            Number.isInteger(circuitModel.alt))
            countKeys--;  

        if (typeof circuitModel.url === 'string')
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfCircuitModel = true;
            console.log("Is Partial Typeof CircuitModel");
        } else {
            console.log("Isn't Partial Typeof CircuitModel");
        }

    } else {
        console.log("Isn't Partial Typeof CircuitModel");
    }

    return isPartialTypeOfCircuitModel;
};