import { SeasonModel } from "../../../models/data/season";

export const isPartialSeasonModel = async (
  seasonModel?: SeasonModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfSeasonModel = false;
    let countKeys = Object.keys(seasonModel as SeasonModel).length

    // SeasonModel must have a defined year
    if (!Array.isArray(seasonModel) &&
            seasonModel !== undefined &&
            typeof seasonModel.year === 'number' &&
            Number.isInteger(seasonModel.year)) {
            
        countKeys--; // typeof seasonModel.year === 'number')

        if (typeof seasonModel.url === 'string')
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfSeasonModel = true;
            console.log("Is Partial Typeof SeasonModel");
        } else {
            console.log("Isn't Partial Typeof SeasonModel");
        }

    } else {
        console.log("Isn't Partial Typeof SeasonModel");
    }

    return isPartialTypeOfSeasonModel;
};