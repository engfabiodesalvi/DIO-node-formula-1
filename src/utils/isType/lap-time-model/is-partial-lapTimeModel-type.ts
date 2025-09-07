import { LapTimeModel } from "../../../models/data/lap-time-model";


export const isPartialLapTimeModel = async (
  lapTimeModel?: LapTimeModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfLapTimeModel = false;
    let countKeys = Object.keys(lapTimeModel as LapTimeModel).length

    // LapTimeModel must have a defined raceId
    if (!Array.isArray(lapTimeModel) &&
            lapTimeModel !== undefined &&
            typeof lapTimeModel.raceId === 'number' &&
            Number.isInteger(lapTimeModel.raceId)) {
            
        countKeys--; // typeof lapTimeModel.raceId === 'number')

        if (typeof lapTimeModel.driverId === 'number' && 
            Number.isFinite(lapTimeModel.driverId))
            countKeys--;   

        if (typeof lapTimeModel.lap === 'number' && 
            Number.isFinite(lapTimeModel.lap))
            countKeys--;                 

        if (typeof lapTimeModel.position === 'number' && 
            Number.isFinite(lapTimeModel.position))
            countKeys--;          

        if (typeof lapTimeModel.time === 'string')
            countKeys--;                                      

        if (typeof lapTimeModel.milliseconds === 'number' && 
            Number.isFinite(lapTimeModel.milliseconds))
            countKeys--;    

        if (countKeys === 0) {
            isPartialTypeOfLapTimeModel = true;
            console.log("Is Partial Typeof LapTimeModel");
        } else {
            console.log("Isn't Partial Typeof LapTimeModel");
        }

    } else {
        console.log("Isn't Partial Typeof LapTimeModel");
    }

    return isPartialTypeOfLapTimeModel;
};