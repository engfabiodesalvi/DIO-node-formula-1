import { SprintResultModel } from "../../../models/data/sprint-result-model";

export const isSprintResultModel = async (
  newSprintResult?: SprintResultModel | undefined
): Promise<boolean> => {
    let isTypeOfSprintResultModel = false;
    const countKeys = Object.keys(newSprintResult as SprintResultModel).length

    if (!Array.isArray(newSprintResult) &&
            newSprintResult !== undefined &&
            typeof newSprintResult.resultId === 'number' && Number.isInteger(newSprintResult.resultId) &&
            typeof newSprintResult.raceId === 'number' && Number.isInteger(newSprintResult.raceId) &&
            typeof newSprintResult.driverId === 'number' && Number.isInteger(newSprintResult.driverId) &&
            typeof newSprintResult.constructorId === 'number' && Number.isInteger(newSprintResult.constructorId) &&
            typeof newSprintResult.number === 'number' && Number.isInteger(newSprintResult.number) &&
            typeof newSprintResult.grid === 'number' && Number.isInteger(newSprintResult.grid) &&
            typeof newSprintResult.position === 'number' && Number.isInteger(newSprintResult.position) &&
            typeof newSprintResult.positionText === 'string' &&
            typeof newSprintResult.positionOrder === 'number' && Number.isInteger(newSprintResult.positionOrder) &&
            typeof newSprintResult.points === 'number' && Number.isInteger(newSprintResult.points) &&
            typeof newSprintResult.laps === 'number' && Number.isInteger(newSprintResult.laps) &&
            typeof newSprintResult.time === 'string' &&
            typeof newSprintResult.milliseconds === 'number' && Number.isInteger(newSprintResult.milliseconds) &&
            typeof newSprintResult.fastestLap === 'number' && Number.isInteger(newSprintResult.fastestLap) &&
            typeof newSprintResult.fastestLapTime === 'string' &&
            typeof newSprintResult.statusId === 'number' && Number.isInteger(newSprintResult.statusId) &&

            countKeys === 16
        ) {                        
   
        isTypeOfSprintResultModel = true;
        console.log("Is Typeof SprintResultModel");
    } else {
        console.log("Isn't Typeof SprintResultModel");
    }

    return isTypeOfSprintResultModel;
};