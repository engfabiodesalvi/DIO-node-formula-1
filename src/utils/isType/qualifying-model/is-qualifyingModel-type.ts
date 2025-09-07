import { QualifyingModel } from "../../../models/data/qualifying-model";

export const isQualifyingModel = async (
  newQualifying?: QualifyingModel | undefined
): Promise<boolean> => {
    let isTypeOfQualifyingModel = false;
    const countKeys = Object.keys(newQualifying as QualifyingModel).length

    if (!Array.isArray(newQualifying) &&
            newQualifying !== undefined &&
            typeof newQualifying.qualifyId === 'number' && Number.isInteger(newQualifying.qualifyId) &&
            typeof newQualifying.raceId === 'number' && Number.isInteger(newQualifying.raceId) &&
            typeof newQualifying.driverId === 'number' && Number.isInteger(newQualifying.driverId) &&
            typeof newQualifying.constructorId === 'number' && Number.isInteger(newQualifying.constructorId) &&
            typeof newQualifying.number === 'number' && Number.isInteger(newQualifying.number) &&
            typeof newQualifying.position === 'number' && Number.isInteger(newQualifying.position) &&
            typeof newQualifying.q1 === 'string' &&
            typeof newQualifying.q2 === 'string' &&
            typeof newQualifying.q3 === 'string' &&
            countKeys === 9
        ) {                        
   
        isTypeOfQualifyingModel = true;
        console.log("Is Typeof QualifyingModel");
    } else {
        console.log("Isn't Typeof QualifyingModel");
    }

    return isTypeOfQualifyingModel;
};