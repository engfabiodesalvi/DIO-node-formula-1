import { RaceModel } from "../../../models/data/race-model";

export const isRaceModel = async (
  newRace?: RaceModel | undefined
): Promise<boolean> => {
    let isTypeOfRaceModel = false;
    const countKeys = Object.keys(newRace as RaceModel).length

    if (!Array.isArray(newRace) &&
            newRace !== undefined &&
            typeof newRace.raceId === 'number' && Number.isInteger(newRace.raceId) &&
            typeof newRace.year === 'number' && Number.isInteger(newRace.year) &&
            typeof newRace.round === 'number' && Number.isInteger(newRace.round) &&
            typeof newRace.circuitId === 'number' && Number.isInteger(newRace.circuitId) &&
            typeof newRace.name === 'string' &&
            typeof newRace.date === 'string' &&
            typeof newRace.time === 'string' &&
            typeof newRace.url === 'string' &&
            typeof newRace.fp1_date === 'string' &&
            typeof newRace.fp1_time === 'string' &&
            typeof newRace.fp2_date === 'string' &&
            typeof newRace.fp2_time === 'string' &&
            typeof newRace.fp3_date === 'string' &&
            typeof newRace.fp3_time === 'string' &&
            typeof newRace.quali_date === 'string' &&
            typeof newRace.quali_time === 'string' &&
            typeof newRace.sprint_date === 'string' &&
            typeof newRace.sprint_time === 'string' &&


            countKeys === 18
        ) {                        
   
        isTypeOfRaceModel = true;
        console.log("Is Typeof RaceModel");
    } else {
        console.log("Isn't Typeof RaceModel");
    }

    return isTypeOfRaceModel;
};