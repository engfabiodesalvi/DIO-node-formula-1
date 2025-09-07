import { StatusModel } from "../../../models/data/status-model";

export const isStatusModel = async (
  newStatus?: StatusModel | undefined
): Promise<boolean> => {
    let isTypeOfStatusModel = false;
    const countKeys = Object.keys(newStatus as StatusModel).length

    if (!Array.isArray(newStatus) &&
            newStatus !== undefined &&
            typeof newStatus.statusId === 'number' && Number.isInteger(newStatus.statusId) &&
            typeof newStatus.status === 'string' &&
            countKeys === 2
        ) {                        
   
        isTypeOfStatusModel = true;
        console.log("Is Typeof StatusModel");
    } else {
        console.log("Isn't Typeof StatusModel");
    }

    return isTypeOfStatusModel;
};