import { ConstructorModel } from "../../../models/data/constructor";

export const isConstructorModel = async (
  newConstructor?: ConstructorModel | undefined
): Promise<boolean> => {
    let isTypeOfConstructorModel = false;
    const countKeys = Object.keys(newConstructor as ConstructorModel).length

    if (!Array.isArray(newConstructor) &&
            newConstructor !== undefined &&
            typeof newConstructor.constructorId === 'number' && Number.isInteger(newConstructor.constructorId) &&
            typeof newConstructor.constructorRef === 'string' &&
            typeof newConstructor.name === 'string' &&
            typeof newConstructor.nationality === 'string' &&
            typeof newConstructor.url === 'string' &&
            countKeys === 5
        ) {                        
   
        isTypeOfConstructorModel = true;
        console.log("Is Typeof ConstructorModel");
    } else {
        console.log("Isn't Typeof ConstructorModel");
    }

    return isTypeOfConstructorModel;
};