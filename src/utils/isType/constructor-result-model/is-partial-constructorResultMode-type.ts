import { ConstructorResultModel } from "../../../models/data/constructor-result-model";

export const isPartialConstructorResultModel = async (
  constructorResultModel?: ConstructorResultModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfConstructorResultModel = false;
    let countKeys = Object.keys(constructorResultModel as ConstructorResultModel).length

    // ConstructorResultModel must have a defined constructorResultsId
    if (!Array.isArray(constructorResultModel) &&
            constructorResultModel !== undefined &&
            typeof constructorResultModel.constructorResultsId === 'number' &&
            Number.isInteger(constructorResultModel.constructorResultsId)) {
            
        countKeys--; // typeof constructorResultModel.constructorResultsId === 'number')

        if (typeof constructorResultModel.raceId === 'number' && 
            Number.isInteger(constructorResultModel.raceId))
            countKeys--;     

        if (typeof constructorResultModel.constructorId === 'number' && 
            Number.isInteger(constructorResultModel.constructorId))
            countKeys--;    

        if (typeof constructorResultModel.points === 'number' && 
            Number.isInteger(constructorResultModel.points))
            countKeys--;     

        if (typeof constructorResultModel.status === 'string')
            countKeys--;                                   
        
        if (countKeys === 0) {
            isPartialTypeOfConstructorResultModel = true;
            console.log("Is Partial Typeof ConstructorResultModel");
        } else {
            console.log("Isn't Partial Typeof ConstructorResultModel");
        }

    } else {
        console.log("Isn't Partial Typeof ConstructorResultModel");
    }

    return isPartialTypeOfConstructorResultModel;
};