import { DriverStandingModel } from "../../../models/data/driver-standing-model";

export const isDriverStandingModel = async (
  newDriverStanding?: DriverStandingModel | undefined
): Promise<boolean> => {
    let isTypeOfDriverStanding = false;
    const countKeys = Object.keys(newDriverStanding as DriverStandingModel).length

    if (!Array.isArray(newDriverStanding) &&
            newDriverStanding !== undefined &&
            typeof newDriverStanding.driverStandingsId === 'number' && Number.isInteger(newDriverStanding.driverStandingsId) &&
            typeof newDriverStanding.raceId === 'number' && Number.isInteger(newDriverStanding.raceId) &&
            typeof newDriverStanding.driverId === 'number' && Number.isInteger(newDriverStanding.driverId) &&
            typeof newDriverStanding.points === 'number' && Number.isInteger(newDriverStanding.points) &&
            typeof newDriverStanding.position === 'number' && Number.isInteger(newDriverStanding.position) &&            
            typeof newDriverStanding.positionText === 'string' &&
            typeof newDriverStanding.wins === 'number' && Number.isInteger(newDriverStanding.wins) &&            

            countKeys === 7
        ) {                        
   
        isTypeOfDriverStanding = true;
        console.log("Is Typeof DriverStandingModel");
    } else {
        console.log("Isn't Typeof DriverStandingModel");
    }

    return isTypeOfDriverStanding;
};