import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import { DriverModel } from '../../models/driver-model';
import path from 'path';

export const language = "utf-8";

// Path for csv driver file
export const pathDriversDataCsv = path.join(__dirname, "../database/csv/drivers.csv");
// Path for json driver file
export const pathDriversDataJson = path.join(__dirname, "../database/json/drivers.json");
console.log(pathDriversDataCsv);

// Drivers data
export let listDrivers: DriverModel[] = [];

export async function sortListDrivers() {
    listDrivers.sort((a, b) => a.driverId - b.driverId);
}

// load csv to DriversModel[] 
export const loadDrivers = async(filePath: string): Promise<DriverModel[]> => {
    let results: DriverModel[] = [];         

    const readCsvFile = fs.createReadStream(filePath);

    // checking that there were no errors opening the file.
    readCsvFile
        .on('error', (error: any) => {
            console.error('An error occurred while opening the file:', error);
        });

    return new Promise((resolve, reject) => {
                readCsvFile                  
                    .pipe(csv.parse( {
                        columns: true, // Treat the first row as column headers (keys)
                    }))
                    .on('data', (data: any) => results.push({
                        driverId: parseInt(data['driverId']) || -1,
                        driverRef: data['driverRef'],
                        number: parseInt(data['number']) || -1,
                        code: (data['code'] == "\\N") ? "" : data['code'],
                        forename: data['forename'],
                        surname: data['surname'],
                        dob: data['dob'],
                        nationality: data['nationality'],
                        url: data['url']
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading drivers from csv file
export const loadDriversCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadDrivers(filePathCsv)
    .then((loadDrivers: DriverModel[]) => {
        listDrivers = loadDrivers;
        if (listDrivers.length > 0) {      
        console.log(listDrivers[0])
        console.log(listDrivers[1])
        console.log(listDrivers[2])
        }    
        saveDriversToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading drives from json file
export const loadDriversJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listDrivers = jsonFile['drivers'];
    if (listDrivers.length > 0) {      
        console.log(listDrivers[0])
        console.log(listDrivers[1])
        console.log(listDrivers[2])
    }        
    console.log("Drivers data loaded from json file!");
};

// save DriversModel[] to json file
export const saveDriversToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {drivers: listDrivers};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to drivers.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external DriversModel[] to json file
export const saveExtDriversToJsonFile = async(filePath: string, driversModel: DriverModel[]) => {
    try {
        const jsonFile = {drivers: driversModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listDrivers = driversModel;

        console.log('JSON data saved to drivers.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathDriversDataJson)) {
    // Load data from json file
    loadDriversJsonFile(pathDriversDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadDriversCsvFile(pathDriversDataCsv, pathDriversDataJson);
    console.log("File does not exists.");
}