import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { QualifyingModel } from '../../models/data/qualifying-model';

export const language = "utf-8";

// Path for csv qualifyings file
export const pathQualifyingsDataCsv = path.join(__dirname, "../database/csv/qualifying.csv");
// Path for json qualifyings file
export const pathQualifyingsDataJson = path.join(__dirname, "../database/json/qualifying.json");
console.log(pathQualifyingsDataCsv);

// Pit Stopss data
export let listQualifyings: QualifyingModel[] = [];

// sorting values through the columns
export async function sortListQualifyings() {
    listQualifyings.sort((a, b) => a.qualifyId - b.qualifyId);
}

// load csv to QualifyingModel[] 
export const loadQualifyings = async(filePath: string): Promise<QualifyingModel[]> => {
    let results: QualifyingModel[] = [];         

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
                        qualifyId: parseInt(data['qualifyId']) || -1,
                        raceId: parseInt(data['raceId']) || -1,
                        driverId: parseInt(data['driverId']) || -1,
                        constructorId: parseInt(data['constructorId']) || -1,
                        number: parseInt(data['number']) || 0,
                        position: parseInt(data['position']) || 0,
                        q1: (data['q1']) === "\\N" ? "" : data['q1'],
                        q2: (data['q2']) === "\\N" ? "" : data['q2'],
                        q3: (data['q3']) === "\\N" ? "" : data['q3'],
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading qualifyings from csv file
export const loadQualifyingsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadQualifyings(filePathCsv)
    .then((loadQualifyings: QualifyingModel[]) => {
        listQualifyings = loadQualifyings;
        if (listQualifyings.length > 0) {      
        console.log(listQualifyings[0])
        console.log(listQualifyings[1])
        console.log(listQualifyings[2])
        }    
        saveQualifyingsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading qualifyings from json file
export const loadQualifyingsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listQualifyings = jsonFile['qualifyings'];
    if (listQualifyings.length > 0) {      
        console.log(listQualifyings[0])
        console.log(listQualifyings[1])
        console.log(listQualifyings[2])
    }        
    console.log("Pit Stops data loaded from json file!");
};

// save QualifyingModel[] to json file
export const saveQualifyingsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {qualifyings: listQualifyings};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to qualifyings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external QualifyingModel[] to json file
export const saveExtQualifyingsToJsonFile = async(filePath: string, qualifyingsModel: QualifyingModel[]) => {
    try {
        const jsonFile = {qualifyings: qualifyingsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listQualifyings = qualifyingsModel;

        console.log('JSON data saved to qualifyings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathQualifyingsDataJson)) {
    // Load data from json file
    loadQualifyingsJsonFile(pathQualifyingsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadQualifyingsCsvFile(pathQualifyingsDataCsv, pathQualifyingsDataJson);
    console.log("File does not exists.");
}