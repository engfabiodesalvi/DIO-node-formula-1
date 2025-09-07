import { ConstructorStandingModel } from "../../../models/data/constructor-standing-model";



export const isPartialConstructorStandingModel = async (
  constructorStandingModel?: ConstructorStandingModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfConstructorStandingModel = false;
    let countKeys = Object.keys(constructorStandingModel as ConstructorStandingModel).length

    // ConstructorStandingModel must have a defined circuitId
    if (!Array.isArray(constructorStandingModel) &&
            constructorStandingModel !== undefined &&
            typeof constructorStandingModel.constructorStandingsId === 'number' &&
            Number.isInteger(constructorStandingModel.constructorStandingsId)) {
            
        countKeys--; // typeof constructorStandingModel.circuitId === 'number')

        if (typeof constructorStandingModel.raceId === 'number' && 
            Number.isInteger(constructorStandingModel.raceId))
            countKeys--;           

        if (typeof constructorStandingModel.constructorId === 'number' && 
            Number.isInteger(constructorStandingModel.constructorId))
            countKeys--;           

        if (typeof constructorStandingModel.points === 'number' && 
            Number.isInteger(constructorStandingModel.points))
            countKeys--;           

        if (typeof constructorStandingModel.position === 'number' && 
            Number.isInteger(constructorStandingModel.position))
            countKeys--;           

        if (typeof constructorStandingModel.positionText === 'string')
            countKeys--;        
        
        if (typeof constructorStandingModel.wins === 'number' && 
            Number.isInteger(constructorStandingModel.wins))
            countKeys--;             
        
        if (countKeys === 0) {
            isPartialTypeOfConstructorStandingModel = true;
            console.log("Is Partial Typeof ConstructorStandingModel");
        } else {
            console.log("Isn't Partial Typeof ConstructorStandingModel");
        }

    } else {
        console.log("Isn't Partial Typeof ConstructorStandingModel");
    }

    return isPartialTypeOfConstructorStandingModel;
};