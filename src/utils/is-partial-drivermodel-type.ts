import { DriverModel } from "../models/driver-model";


export const isPartialDriverModel = async (
  driverModel?: DriverModel | undefined
): Promise<boolean> => {
    let isPartialTypeOfDriverModel = false;
    let countKeys = Object.keys(driverModel as DriverModel).length

    // DriverModel must have a defined driverId
    if (!Array.isArray(driverModel) &&
            driverModel !== undefined &&
            typeof driverModel.driverId === 'number') {
            
        countKeys--; // typeof driverModel.driverId === 'number')

        if (typeof driverModel.driverRef === 'string')
            countKeys--;

        if (typeof driverModel.number === 'number')
            countKeys--;     

        if (typeof driverModel.code === 'string')
            countKeys--;

        if (typeof driverModel.forename === 'string')
            countKeys--;

        if (typeof driverModel.surname === 'string')
            countKeys--;

        if (typeof driverModel.dob === 'string')
            countKeys--;
        
        if (typeof driverModel.nationality === 'string')
            countKeys--;

        if (typeof driverModel.url === 'string')
            countKeys--;                                      
        
        if (countKeys === 0) {
            isPartialTypeOfDriverModel = true;
            console.log("Is Partial Typeof DriverModel");
        } else {
            console.log("Isn't Partial Typeof DriverModel");
        }

    } else {
        console.log("Isn't Partial Typeof DriverModel");
    }

    return isPartialTypeOfDriverModel;
};