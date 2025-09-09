import { ResultModel } from "../../../models/data/result";

export const isPartialResultModel = async (
  resultModel?: ResultModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfResultModel = false;
    let countKeys = Object.keys(resultModel as ResultModel).length

    // ResultModel must have a defined resultId
    if (!Array.isArray(resultModel) &&
            resultModel !== undefined &&
            typeof resultModel.resultId === 'number' &&
            Number.isInteger(resultModel.resultId)) {
            
        countKeys--; // typeof resultModel.resultId === 'number')

        if (typeof resultModel.raceId === 'number' && 
            Number.isInteger(resultModel.raceId))
            countKeys--;     

        if (typeof resultModel.driverId === 'number' && 
            Number.isInteger(resultModel.driverId))
            countKeys--;     

        if (typeof resultModel.constructorId === 'number' && 
            Number.isInteger(resultModel.constructorId))
            countKeys--;    

        if (typeof resultModel.number === 'number' && 
            Number.isInteger(resultModel.number))
            countKeys--;  

        if (typeof resultModel.grid === 'number' && 
            Number.isInteger(resultModel.grid))
            countKeys--;    

        if (typeof resultModel.position === 'number' && 
            Number.isInteger(resultModel.position))
            countKeys--;     

        if (typeof resultModel.positionText === 'string')
            countKeys--;

        if (typeof resultModel.positionOrder === 'number' && 
            Number.isInteger(resultModel.positionOrder))
            countKeys--;     

        if (typeof resultModel.points === 'number' && 
            Number.isInteger(resultModel.points))
            countKeys--;     

        if (typeof resultModel.laps === 'number' && 
            Number.isInteger(resultModel.laps))
            countKeys--;     

        if (typeof resultModel.time === 'string')
            countKeys--;

        if (typeof resultModel.milliseconds === 'number' && 
            Number.isInteger(resultModel.milliseconds))
            countKeys--;     

        if (typeof resultModel.fastestLap === 'number' && 
            Number.isInteger(resultModel.fastestLap))
            countKeys--;     

        if (typeof resultModel.rank === 'number' && 
            Number.isInteger(resultModel.rank))
            countKeys--;     

        if (typeof resultModel.fastestLapTime === 'string')
            countKeys--;

        if (typeof resultModel.fastestLapSpeed === 'string')
            countKeys--;

        if (typeof resultModel.statusId === 'number')
            countKeys--;                                     
        
        if (countKeys === 0) {
            isPartialTypeOfResultModel = true;
            console.log("Is Partial Typeof ResultModel");
        } else {
            console.log("Isn't Partial Typeof ResultModel");
        }

    } else {
        console.log("Isn't Partial Typeof ResultModel");
    }

    return isPartialTypeOfResultModel;
};