import { ConstructorModel } from "../../../models/data/constructor";


export const isPartialConstructorModel = async (
  circuitModel?: ConstructorModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfConstructorModel = false;
    let countKeys = Object.keys(circuitModel as ConstructorModel).length

    // ConstructorModel must have a defined constructorId
    if (!Array.isArray(circuitModel) &&
            circuitModel !== undefined &&
            typeof circuitModel.constructorId === 'number' &&
            Number.isInteger(circuitModel.constructorId)) {
            
        countKeys--; // typeof circuitModel.constructorId === 'number')

        if (typeof circuitModel.constructorRef === 'string')
            countKeys--;

        if (typeof circuitModel.name === 'string')
            countKeys--;

        if (typeof circuitModel.nationality === 'string')
            countKeys--;

        if (typeof circuitModel.url === 'string')
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfConstructorModel = true;
            console.log("Is Partial Typeof ConstructorModel");
        } else {
            console.log("Isn't Partial Typeof ConstructorModel");
        }

    } else {
        console.log("Isn't Partial Typeof ConstructorModel");
    }

    return isPartialTypeOfConstructorModel;
};