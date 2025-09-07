import { PitStopModel } from "../../../models/data/pit-stop-model";

export const isPartialPitStopModel = async (
  pitStopModel?: PitStopModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfPitStopModel = false;
    let countKeys = Object.keys(pitStopModel as PitStopModel).length

    // PitStopModel must have a defined raceId
    if (!Array.isArray(pitStopModel) &&
            pitStopModel !== undefined &&
            typeof pitStopModel.raceId === 'number' &&
            Number.isInteger(pitStopModel.raceId)) {
            
        countKeys--; // typeof pitStopModel.raceId === 'number')

        if (typeof pitStopModel.driverId === 'number' && 
            Number.isFinite(pitStopModel.driverId))
            countKeys--;                 

        if (typeof pitStopModel.stop === 'number' && 
            Number.isFinite(pitStopModel.stop))
            countKeys--;                 

        if (typeof pitStopModel.lap === 'number' && 
            Number.isFinite(pitStopModel.lap))
            countKeys--;                                        

        if (typeof pitStopModel.time === 'string')
            countKeys--;

        if (typeof pitStopModel.duration === 'string')
            countKeys--;                                    

        if (typeof pitStopModel.milliseconds === 'number' && 
            Number.isFinite(pitStopModel.milliseconds))
            countKeys--;  

        if (countKeys === 0) {
            isPartialTypeOfPitStopModel = true;
            console.log("Is Partial Typeof PitStopModel");
        } else {
            console.log("Isn't Partial Typeof PitStopModel");
        }

    } else {
        console.log("Isn't Partial Typeof PitStopModel");
    }

    return isPartialTypeOfPitStopModel;
};