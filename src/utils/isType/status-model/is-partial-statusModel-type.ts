import { StatusModel } from "../../../models/data/status-model";

export const isPartialStatusModel = async (
  statusModel?: StatusModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfStatusModel = false;
    let countKeys = Object.keys(statusModel as StatusModel).length

    // StatusModel must have a defined statusId
    if (!Array.isArray(statusModel) &&
            statusModel !== undefined &&
            typeof statusModel.statusId === 'number' &&
            Number.isInteger(statusModel.statusId)) {
            
        countKeys--; // typeof statusModel.statusId === 'number')

        if (typeof statusModel.status === 'string')
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfStatusModel = true;
            console.log("Is Partial Typeof StatusModel");
        } else {
            console.log("Isn't Partial Typeof StatusModel");
        }

    } else {
        console.log("Isn't Partial Typeof StatusModel");
    }

    return isPartialTypeOfStatusModel;
};