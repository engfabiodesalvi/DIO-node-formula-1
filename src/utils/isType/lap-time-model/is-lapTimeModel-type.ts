import { LapTimeModel } from "../../../models/data/lap-time-model";

export const isLapTimeModel = async (
  newLapTime?: LapTimeModel | undefined
): Promise<boolean> => {
    let isTypeOfLapTimeModel = false;
    const countKeys = Object.keys(newLapTime as LapTimeModel).length

    if (!Array.isArray(newLapTime) &&
            newLapTime !== undefined &&
            typeof newLapTime.raceId === 'number' && Number.isInteger(newLapTime.raceId) &&
            typeof newLapTime.driverId === 'number' && Number.isInteger(newLapTime.driverId) &&
            typeof newLapTime.lap === 'number' && Number.isInteger(newLapTime.lap) &&
            typeof newLapTime.position === 'number' && Number.isInteger(newLapTime.position) &&            
            typeof newLapTime.time === 'string' &&
            typeof newLapTime.milliseconds === 'number' && Number.isInteger(newLapTime.milliseconds) &&            
            countKeys === 6
        ) {                        
   
        isTypeOfLapTimeModel = true;
        console.log("Is Typeof LapTimeModel");
    } else {
        console.log("Isn't Typeof LapTimeModel");
    }

    return isTypeOfLapTimeModel;
};