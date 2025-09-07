import { SeasonModel } from "../../../models/data/season";

export const isSeasonModel = async (
  newSeason?: SeasonModel | undefined
): Promise<boolean> => {
    let isTypeOfSeasonModel = false;
    const countKeys = Object.keys(newSeason as SeasonModel).length

    if (!Array.isArray(newSeason) &&
            newSeason !== undefined &&
            typeof newSeason.year === 'number' && Number.isInteger(newSeason.year) &&
            typeof newSeason.url === 'string' &&
            countKeys === 2
        ) {                        
   
        isTypeOfSeasonModel = true;
        console.log("Is Typeof SeasonModel");
    } else {
        console.log("Isn't Typeof SeasonModel");
    }

    return isTypeOfSeasonModel;
};