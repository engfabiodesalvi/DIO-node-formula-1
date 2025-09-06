import { DriverModel } from "../models/data/driver-model";

export const isDriverModel = async (
  newDriver?: DriverModel | undefined
): Promise<boolean> => {
    let isTypeOfDriverModel = false;
    const countKeys = Object.keys(newDriver as DriverModel).length

    if (!Array.isArray(newDriver) &&
            newDriver !== undefined &&
            typeof newDriver.driverId === 'number' && Number.isInteger(newDriver.driverId) &&
            typeof newDriver.driverRef === 'string' &&
            typeof newDriver.number === 'number' && Number.isInteger(newDriver.number) &&
            typeof newDriver.code === 'string' &&
            typeof newDriver.forename === 'string' &&
            typeof newDriver.surname === 'string' &&
            typeof newDriver.dob === 'string' &&
            typeof newDriver.nationality === 'string' &&
            typeof newDriver.url === 'string' &&
            countKeys === 9
        ) {                        
   
        isTypeOfDriverModel = true;
        console.log("Is Typeof DriverModel");
    } else {
        console.log("Isn't Typeof DriverModel");
    }

    return isTypeOfDriverModel;
};