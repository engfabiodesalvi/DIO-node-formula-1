import { SprintResultModel } from "../../../models/data/sprint-result-model";

export const isPartialSprintResultModel = async (
  sprintResultModel?: SprintResultModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfSprintResultModel = false;
    let countKeys = Object.keys(sprintResultModel as SprintResultModel).length

    // SprintResultModel must have a defined resultId
    if (!Array.isArray(sprintResultModel) &&
            sprintResultModel !== undefined &&
            typeof sprintResultModel.resultId === 'number' &&
            Number.isInteger(sprintResultModel.resultId)) {
            
        countKeys--; // typeof sprintResultModel.resultId === 'number')

        if (typeof sprintResultModel.raceId === 'number' && 
            Number.isInteger(sprintResultModel.raceId))
            countKeys--;     

        if (typeof sprintResultModel.driverId === 'number' && 
            Number.isInteger(sprintResultModel.driverId))
            countKeys--;     

        if (typeof sprintResultModel.constructorId === 'number' && 
            Number.isInteger(sprintResultModel.constructorId))
            countKeys--;     

        if (typeof sprintResultModel.number === 'number' && 
            Number.isInteger(sprintResultModel.number))
            countKeys--;     

        if (typeof sprintResultModel.grid === 'number' && 
            Number.isInteger(sprintResultModel.grid))
            countKeys--;     

        if (typeof sprintResultModel.position === 'number' && 
            Number.isInteger(sprintResultModel.position))
            countKeys--;               

        if (typeof sprintResultModel.positionText === 'string')
            countKeys--;

        if (typeof sprintResultModel.positionOrder === 'number' && 
            Number.isInteger(sprintResultModel.positionOrder))
            countKeys--;   

        if (typeof sprintResultModel.points === 'number' && 
            Number.isInteger(sprintResultModel.points))
            countKeys--;     

        if (typeof sprintResultModel.laps === 'number' && 
            Number.isInteger(sprintResultModel.laps))
            countKeys--;     

        if (typeof sprintResultModel.time === 'string')
            countKeys--;

        if (typeof sprintResultModel.milliseconds === 'number' && 
            Number.isInteger(sprintResultModel.milliseconds))
            countKeys--;     

        if (typeof sprintResultModel.fastestLap === 'number' && 
            Number.isInteger(sprintResultModel.fastestLap))
            countKeys--;     

        if (typeof sprintResultModel.fastestLapTime === 'string')
            countKeys--; 

        if (typeof sprintResultModel.statusId === 'number' && 
            Number.isInteger(sprintResultModel.statusId))
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfSprintResultModel = true;
            console.log("Is Partial Typeof SprintResultModel");
        } else {
            console.log("Isn't Partial Typeof SprintResultModel");
        }

    } else {
        console.log("Isn't Partial Typeof SprintResultModel");
    }

    return isPartialTypeOfSprintResultModel;
};