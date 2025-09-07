import { ConstructorStandingModel } from "../../../models/data/constructor-standing-model";

export const isConstructorStandingModel = async (
  newConstructorStanding?: ConstructorStandingModel | undefined
): Promise<boolean> => {
    let isTypeOfConstructorStanding = false;
    const countKeys = Object.keys(newConstructorStanding as ConstructorStandingModel).length

    if (!Array.isArray(newConstructorStanding) &&
            newConstructorStanding !== undefined &&
            typeof newConstructorStanding.constructorStandingsId === 'number' && Number.isInteger(newConstructorStanding.constructorStandingsId) &&
            typeof newConstructorStanding.raceId === 'number' && Number.isInteger(newConstructorStanding.raceId) &&         
            typeof newConstructorStanding.constructorId === 'number' && Number.isInteger(newConstructorStanding.constructorId) &&         
            typeof newConstructorStanding.points === 'number' && Number.isInteger(newConstructorStanding.points) &&
            typeof newConstructorStanding.position === 'number' && Number.isInteger(newConstructorStanding.position) &&
            typeof newConstructorStanding.positionText === 'string' &&
            typeof newConstructorStanding.wins === 'number' && Number.isInteger(newConstructorStanding.wins) &&
            countKeys === 7
        ) {                        
   
        isTypeOfConstructorStanding = true;
        console.log("Is Typeof ConstructorStandingModel");
    } else {
        console.log("Isn't Typeof ConstructorStandingModel");
    }

    return isTypeOfConstructorStanding;
};
