import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { DriverStandingModel } from '../../models/data/driver-standing-model';

export const language = "utf-8";

// Path for csv driver standings file
export const pathDriverStandingsDataCsv = path.join(__dirname, "../database/csv/driver_standings.csv");
// Path for json driver standings file
export const pathDriverStandingsDataJson = path.join(__dirname, "../database/json/driver-standings.json");
console.log(pathDriverStandingsDataCsv);

// Drivers data
export let listDriverStandings: DriverStandingModel[] = [];

export async function sortListDriverStandings() {
    listDriverStandings.sort((a, b) => a.driverStandingsId - b.driverStandingsId);
}

// load csv to DriverStandingModel[] 
export const loadDriverStandings = async(filePath: string): Promise<DriverStandingModel[]> => {
    let results: DriverStandingModel[] = [];         

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
                        driverStandingsId: parseInt(data['driverStandingsId']) || -1,
                        raceId: parseInt(data['raceId']) || -1,
                        driverId: parseInt(data['driverId']) || -1,
                        points: parseInt(data['points']) || 0,
                        position: parseInt(data['position']) || 0,
                        positionText: data['positionText'],
                        wins: parseInt(data['wins']) || 0
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading constructorStandings from csv file
export const loadDriverStandingsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadDriverStandings(filePathCsv)
    .then((loadDriverStandings: DriverStandingModel[]) => {
        listDriverStandings = loadDriverStandings;
        if (listDriverStandings.length > 0) {      
        console.log(listDriverStandings[0])
        console.log(listDriverStandings[1])
        console.log(listDriverStandings[2])
        }    
        saveDriverStandingsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading constructorStandings from json file
export const loadDriverStandingsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listDriverStandings = jsonFile['constructorStandings'];
    if (listDriverStandings.length > 0) {      
        console.log(listDriverStandings[0])
        console.log(listDriverStandings[1])
        console.log(listDriverStandings[2])
    }        
    console.log("Driver Standings data loaded from json file!");
};

// save DriverStandingModel[] to json file
export const saveDriverStandingsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {constructorStandings: listDriverStandings};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to driver-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external DriverStandingModel[] to json file
export const saveExtDriverStandingsToJsonFile = async(filePath: string, constructorStandingsModel: DriverStandingModel[]) => {
    try {
        const jsonFile = {constructorStandings: constructorStandingsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listDriverStandings = constructorStandingsModel;

        console.log('JSON data saved to driver-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathDriverStandingsDataJson)) {
    // Load data from json file
    loadDriverStandingsJsonFile(pathDriverStandingsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadDriverStandingsCsvFile(pathDriverStandingsDataCsv, pathDriverStandingsDataJson);
    console.log("File does not exists.");
}