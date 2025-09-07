import { QualifyingModel } from "../../../models/data/qualifying-model";


export const isPartialQualifyingModel = async (
  qualifyingModel?: QualifyingModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfQualifyingModel = false;
    let countKeys = Object.keys(qualifyingModel as QualifyingModel).length

    // QualifyingModel must have a defined qualifyId
    if (!Array.isArray(qualifyingModel) &&
            qualifyingModel !== undefined &&
            typeof qualifyingModel.qualifyId === 'number' &&
            Number.isInteger(qualifyingModel.qualifyId)) {
            
        countKeys--; // typeof qualifyingModel.qualifyId === 'number')

        if (typeof qualifyingModel.raceId === 'number' && 
            Number.isFinite(qualifyingModel.raceId))
            countKeys--;         

        if (typeof qualifyingModel.driverId === 'number' && 
            Number.isFinite(qualifyingModel.driverId))
            countKeys--; 
            
        if (typeof qualifyingModel.constructorId === 'number' && 
            Number.isFinite(qualifyingModel.constructorId))
            countKeys--; 
            
        if (typeof qualifyingModel.number === 'number' && 
            Number.isFinite(qualifyingModel.number))
            countKeys--; 
            
        if (typeof qualifyingModel.position === 'number' && 
            Number.isFinite(qualifyingModel.position))
            countKeys--; 

        if (typeof qualifyingModel.q1 === 'string')
            countKeys--;

        if (typeof qualifyingModel.q2 === 'string')
            countKeys--;

        if (typeof qualifyingModel.q3 === 'string')
            countKeys--;                                 
        
        if (countKeys === 0) {
            isPartialTypeOfQualifyingModel = true;
            console.log("Is Partial Typeof QualifyingModel");
        } else {
            console.log("Isn't Partial Typeof QualifyingModel");
        }

    } else {
        console.log("Isn't Partial Typeof QualifyingModel");
    }

    return isPartialTypeOfQualifyingModel;
};