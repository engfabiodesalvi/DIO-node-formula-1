import { CircuitModel } from "../models/data/circuit-model";

export const isCircuitModel = async (
  newCircuit?: CircuitModel | undefined
): Promise<boolean> => {
    let isTypeOfCircuitModel = false;
    const countKeys = Object.keys(newCircuit as CircuitModel).length

    if (!Array.isArray(newCircuit) &&
            newCircuit !== undefined &&
            typeof newCircuit.circuitId === 'number' && Number.isInteger(newCircuit.circuitId) &&
            typeof newCircuit.circuitRef === 'string' &&
            typeof newCircuit.name === 'string' &&
            typeof newCircuit.location === 'string' &&
            typeof newCircuit.country === 'string' &&
            typeof newCircuit.lat === 'number' && Number.isFinite(newCircuit.lat) &&
            typeof newCircuit.lng === 'number' && Number.isFinite(newCircuit.lng) &&
            typeof newCircuit.alt === 'number' && Number.isInteger(newCircuit.alt) &&
            typeof newCircuit.url === 'string' &&
            countKeys === 9
        ) {                        
   
        isTypeOfCircuitModel = true;
        console.log("Is Typeof CircuitModel");
    } else {
        console.log("Isn't Typeof CircuitModel");
    }

    return isTypeOfCircuitModel;
};