import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { RaceModel } from '../../models/data/race-model';

export const language = "utf-8";

// Path for csv races file
export const pathRacesDataCsv = path.join(__dirname, "../database/csv/races.csv");
// Path for json races file
export const pathRacesDataJson = path.join(__dirname, "../database/json/races.json");
console.log(pathRacesDataCsv);

// Racess data
export let listRaces: RaceModel[] = [];

// sorting values through the columns
export async function sortListRaces() {
    listRaces.sort((a, b) => a.raceId - b.raceId);
}

// load csv to RaceModel[] 
export const loadRaces = async(filePath: string): Promise<RaceModel[]> => {
    let results: RaceModel[] = [];         

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
                        raceId: parseInt(data['raceId']) || -1,
                        year: parseInt(data['year']) || -1,
                        round: parseInt(data['round']) || -1,
                        circuitId: parseInt(data['circuitId']) || -1,
                        name: (data['name']) === "\\N" ? "" : data['name'],
                        date: (data['date']) === "\\N" ? "" : data['date'],
                        time: (data['time']) === "\\N" ? "" : data['time'],
                        url: (data['url']) === "\\N" ? "" : data['url'],
                        fp1_date: (data['fp1_date']) === "\\N" ? "" : data['fp1_date'],
                        fp1_time: (data['fp1_time']) === "\\N" ? "" : data['fp1_time'],
                        fp2_date: (data['fp2_date']) === "\\N" ? "" : data['fp2_date'],
                        fp2_time: (data['fp2_time']) === "\\N" ? "" : data['fp2_time'],
                        fp3_date: (data['fp3_date']) === "\\N" ? "" : data['fp3_date'],
                        fp3_time: (data['fp3_time']) === "\\N" ? "" : data['fp3_time'],
                        quali_date: (data['quali_date']) === "\\N" ? "" : data['quali_date'],
                        quali_time: (data['quali_time']) === "\\N" ? "" : data['quali_time'],
                        sprint_date: (data['sprint_date']) === "\\N" ? "" : data['sprint_date'],
                        sprint_time: (data['sprint_time']) === "\\N" ? "" : data['spint_time']
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading races from csv file
export const loadRacesCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadRaces(filePathCsv)
    .then((loadRaces: RaceModel[]) => {
        listRaces = loadRaces;
        if (listRaces.length > 0) {      
        console.log(listRaces[0])
        console.log(listRaces[1])
        console.log(listRaces[2])
        }    
        saveRacesToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading races from json file
export const loadRacesJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listRaces = jsonFile['races'];
    if (listRaces.length > 0) {      
        console.log(listRaces[0])
        console.log(listRaces[1])
        console.log(listRaces[2])
    }        
    console.log("Races data loaded from json file!");
};

// save RaceModel[] to json file
export const saveRacesToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {races: listRaces};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to races.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external RaceModel[] to json file
export const saveExtRacesToJsonFile = async(filePath: string, racesModel: RaceModel[]) => {
    try {
        const jsonFile = {races: racesModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listRaces = racesModel;

        console.log('JSON data saved to races.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathRacesDataJson)) {
    // Load data from json file
    loadRacesJsonFile(pathRacesDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadRacesCsvFile(pathRacesDataCsv, pathRacesDataJson);
    console.log("File does not exists.");
}