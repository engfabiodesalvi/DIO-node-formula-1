import { PitStopModel } from "../../../models/data/pit-stop-model";


export const isPitStopModel = async (
  newPitStop?: PitStopModel | undefined
): Promise<boolean> => {
    let isTypeOfPitStopModel = false;
    const countKeys = Object.keys(newPitStop as PitStopModel).length

    if (!Array.isArray(newPitStop) &&
            newPitStop !== undefined &&
            typeof newPitStop.raceId === 'number' && Number.isInteger(newPitStop.raceId) &&
            typeof newPitStop.driverId === 'number' && Number.isInteger(newPitStop.driverId) &&
            typeof newPitStop.stop === 'number' && Number.isInteger(newPitStop.stop) &&
            typeof newPitStop.lap === 'number' && Number.isInteger(newPitStop.lap) &&
            typeof newPitStop.time === 'string' &&
            typeof newPitStop.duration === 'string' &&
            typeof newPitStop.milliseconds === 'number' && Number.isInteger(newPitStop.milliseconds) &&
            countKeys === 7
        ) {                        
   
        isTypeOfPitStopModel = true;
        console.log("Is Typeof PitStopModel");
    } else {
        console.log("Isn't Typeof PitStopModel");
    }

    return isTypeOfPitStopModel;
};