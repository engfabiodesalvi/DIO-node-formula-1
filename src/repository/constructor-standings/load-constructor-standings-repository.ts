import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { ConstructorStandingModel } from '../../models/data/constructor-standing-model';

export const language = "utf-8";

// Path for csv driver file
export const pathConstructorStandingsDataCsv = path.join(__dirname, "../database/csv/constructor_standings.csv");
// Path for json driver file
export const pathConstructorStandingsDataJson = path.join(__dirname, "../database/json/constructor-standings.json");
console.log(pathConstructorStandingsDataCsv);

// Drivers data
export let listConstructorStandings: ConstructorStandingModel[] = [];

export async function sortListConstructorStandings() {
    listConstructorStandings.sort((a, b) => a.constructorStandingsId - b.constructorStandingsId);
}

// load csv to ConstructorStandingModel[] 
export const loadConstructorStandings = async(filePath: string): Promise<ConstructorStandingModel[]> => {
    let results: ConstructorStandingModel[] = [];         

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
                        constructorStandingsId: parseInt(data['constructorStandingsId']) || -1,
                        raceId: parseInt(data['raceId']) || -1,
                        constructorId: parseInt(data['constructorId']) || -1,
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
export const loadConstructorStandingsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadConstructorStandings(filePathCsv)
    .then((loadConstructorStandings: ConstructorStandingModel[]) => {
        listConstructorStandings = loadConstructorStandings;
        if (listConstructorStandings.length > 0) {      
        console.log(listConstructorStandings[0])
        console.log(listConstructorStandings[1])
        console.log(listConstructorStandings[2])
        }    
        saveConstructorStandingsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading constructorStandings from json file
export const loadConstructorStandingsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listConstructorStandings = jsonFile['constructorStandings'];
    if (listConstructorStandings.length > 0) {      
        console.log(listConstructorStandings[0])
        console.log(listConstructorStandings[1])
        console.log(listConstructorStandings[2])
    }        
    console.log("Constructor Standings data loaded from json file!");
};

// save ConstructorStandingModel[] to json file
export const saveConstructorStandingsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {constructorStandings: listConstructorStandings};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to constructor-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external ConstructorStandingModel[] to json file
export const saveExtConstructorStandingsToJsonFile = async(filePath: string, constructorStandingsModel: ConstructorStandingModel[]) => {
    try {
        const jsonFile = {constructorStandings: constructorStandingsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listConstructorStandings = constructorStandingsModel;

        console.log('JSON data saved to constructor-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathConstructorStandingsDataJson)) {
    // Load data from json file
    loadConstructorStandingsJsonFile(pathConstructorStandingsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadConstructorStandingsCsvFile(pathConstructorStandingsDataCsv, pathConstructorStandingsDataJson);
    console.log("File does not exists.");
}