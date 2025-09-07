import { DriverStandingModel } from "../../../models/data/driver-standing-model";


export const isPartialDriverStandingModel = async (
  driverStandingModel?: DriverStandingModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfDriverStandingModel = false;
    let countKeys = Object.keys(driverStandingModel as DriverStandingModel).length

    // DriverStandingModel must have a defined driverStandingsId
    if (!Array.isArray(driverStandingModel) &&
            driverStandingModel !== undefined &&
            typeof driverStandingModel.driverStandingsId === 'number' &&
            Number.isInteger(driverStandingModel.driverStandingsId)) {
            
        countKeys--; // typeof driverStandingModel.driverStandingsId === 'number')

        if (typeof driverStandingModel.raceId === 'number' && 
            Number.isInteger(driverStandingModel.raceId))
            countKeys--;  

        if (typeof driverStandingModel.driverId === 'number' && 
            Number.isInteger(driverStandingModel.driverId))
            countKeys--;              

        if (typeof driverStandingModel.points === 'number' && 
            Number.isInteger(driverStandingModel.points))
            countKeys--;  
            
        if (typeof driverStandingModel.position === 'number' && 
            Number.isInteger(driverStandingModel.position))
            countKeys--;              

        if (typeof driverStandingModel.positionText === 'string')
            countKeys--;          
            
        if (typeof driverStandingModel.wins === 'number' && 
            Number.isInteger(driverStandingModel.wins))
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfDriverStandingModel = true;
            console.log("Is Partial Typeof DriverStandingModel");
        } else {
            console.log("Isn't Partial Typeof DriverStandingModel");
        }

    } else {
        console.log("Isn't Partial Typeof DriverStandingModel");
    }

    return isPartialTypeOfDriverStandingModel;
};