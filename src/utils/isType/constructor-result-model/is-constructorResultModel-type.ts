import { ConstructorResultModel } from "../../../models/data/constructor-result-model";

export const isConstructorResultModel = async (
  newConstructorResult?: ConstructorResultModel | undefined
): Promise<boolean> => {
    let isTypeOfConstructorResultModel = false;
    const countKeys = Object.keys(newConstructorResult as ConstructorResultModel).length

    if (!Array.isArray(newConstructorResult) &&
            newConstructorResult !== undefined &&
            typeof newConstructorResult.constructorResultsId === 'number' && Number.isInteger(newConstructorResult.constructorResultsId) &&
            typeof newConstructorResult.raceId === 'number' && Number.isInteger(newConstructorResult.raceId) &&
            typeof newConstructorResult.constructorId === 'number' && Number.isInteger(newConstructorResult.constructorId) &&
            typeof newConstructorResult.points === 'number' && Number.isInteger(newConstructorResult.points) &&

            typeof newConstructorResult.status === 'string' &&

            countKeys === 5
        ) {                        
   
        isTypeOfConstructorResultModel = true;
        console.log("Is Typeof ConstructorResultModel");
    } else {
        console.log("Isn't Typeof ConstructorResultModel");
    }

    return isTypeOfConstructorResultModel;
};