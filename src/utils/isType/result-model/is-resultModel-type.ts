import { ResultModel } from "../../../models/data/result";


export const isResultModel = async (
  newResult?: ResultModel | undefined
): Promise<boolean> => {
    let isTypeOfResultModel = false;
    const countKeys = Object.keys(newResult as ResultModel).length

    if (!Array.isArray(newResult) &&
            newResult !== undefined &&
            typeof newResult.resultId === 'number' && Number.isInteger(newResult.resultId) &&
            typeof newResult.raceId === 'number' && Number.isInteger(newResult.raceId) &&
            typeof newResult.driverId === 'number' && Number.isInteger(newResult.driverId) &&
            typeof newResult.constructorId === 'number' && Number.isInteger(newResult.constructorId) &&
            typeof newResult.number === 'number' && Number.isInteger(newResult.number) &&
            typeof newResult.grid === 'number' && Number.isInteger(newResult.grid) &&
            typeof newResult.position === 'number' && Number.isInteger(newResult.position) &&
            typeof newResult.positionText === 'string' &&
            typeof newResult.positionOrder === 'number' && Number.isInteger(newResult.positionOrder) &&
            typeof newResult.points === 'number' && Number.isInteger(newResult.points) &&
            typeof newResult.laps === 'number' && Number.isInteger(newResult.laps) &&
            typeof newResult.time === 'string' &&
            typeof newResult.milliseconds === 'number' && Number.isInteger(newResult.milliseconds) &&
            typeof newResult.fastestLap === 'number' && Number.isInteger(newResult.fastestLap) &&
            typeof newResult.rank === 'number' && Number.isInteger(newResult.rank) &&
            typeof newResult.fastestLapTime === 'string' &&
            typeof newResult.fastestLapSpeed === 'string' &&
            typeof newResult.statusId === 'number' && Number.isInteger(newResult.statusId) &&
            countKeys === 18
        ) {                        
   
        isTypeOfResultModel = true;
        console.log("Is Typeof ResultModel");
    } else {
        console.log("Isn't Typeof ResultModel");
    }

    return isTypeOfResultModel;
};