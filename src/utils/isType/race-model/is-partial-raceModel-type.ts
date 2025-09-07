import { RaceModel } from "../../../models/data/race-model";


export const isPartialRaceModel = async (
  raceModel?: RaceModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfRaceModel = false;
    let countKeys = Object.keys(raceModel as RaceModel).length

    // RaceModel must have a defined raceId
    if (!Array.isArray(raceModel) &&
            raceModel !== undefined &&
            typeof raceModel.raceId === 'number' &&
            Number.isInteger(raceModel.raceId)) {
            
        countKeys--; // typeof raceModel.raceId === 'number')

        if (typeof raceModel.year === 'number' && 
            Number.isInteger(raceModel.year))
            countKeys--;     
            
        if (typeof raceModel.round === 'number' && 
            Number.isInteger(raceModel.round))
            countKeys--;     
            
        if (typeof raceModel.circuitId === 'number' && 
            Number.isInteger(raceModel.circuitId))
            countKeys--;                 

        if (typeof raceModel.name === 'string')
            countKeys--;

        if (typeof raceModel.date === 'string')
            countKeys--;

        if (typeof raceModel.time === 'string')
            countKeys--;

        if (typeof raceModel.url === 'string')
            countKeys--;

        if (typeof raceModel.fp1_date === 'string')
            countKeys--;

        if (typeof raceModel.fp1_time === 'string')
            countKeys--;

        if (typeof raceModel.fp2_date === 'string')
            countKeys--;

        if (typeof raceModel.fp2_time === 'string')
            countKeys--;

        if (typeof raceModel.fp3_date === 'string')
            countKeys--;

        if (typeof raceModel.fp3_time === 'string')
            countKeys--;                
                                 
        if (typeof raceModel.quali_date === 'string')
            countKeys--;

        if (typeof raceModel.quali_time === 'string')
            countKeys--;  
                                 
        if (typeof raceModel.sprint_date === 'string')
            countKeys--;

        if (typeof raceModel.sprint_time === 'string')
            countKeys--; 

        if (countKeys === 0) {
            isPartialTypeOfRaceModel = true;
            console.log("Is Partial Typeof RaceModel");
        } else {
            console.log("Isn't Partial Typeof RaceModel");
        }

    } else {
        console.log("Isn't Partial Typeof RaceModel");
    }

    return isPartialTypeOfRaceModel;
};