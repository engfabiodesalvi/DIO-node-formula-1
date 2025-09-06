import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { ConstructorResultModel } from '../../models/data/constructor-result-model';

export const language = "utf-8";

// Path for csv driver file
export const pathConstructorResultsDataCsv = path.join(__dirname, "../database/csv/constructor_results.csv");
// Path for json driver file
export const pathConstructorResultsDataJson = path.join(__dirname, "../database/json/constructor-results.json");
console.log(pathConstructorResultsDataCsv);

// Drivers data
export let listConstructorResults: ConstructorResultModel[] = [];

export async function sortListCircuits() {
    listConstructorResults.sort((a, b) => a.constructorResultsId - b.constructorResultsId);
}

// load csv to ConstructorResultModel[] 
export const loadConstructorResults = async(filePath: string): Promise<ConstructorResultModel[]> => {
    let results: ConstructorResultModel[] = [];         

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
                        constructorResultsId: parseInt(data['constructorResultsId']) || -1,
                        raceId: parseInt(data['raceId']) || -1,
                        constructorId: parseInt(data['constructorId']) || -1,
                        points: parseInt(data['points']) || 0,
                        status: (data['status']=="\\N")? "" : data['status']
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading constructorResults from csv file
export const loadConstructorResultsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadConstructorResults(filePathCsv)
    .then((loadConstructorResults: ConstructorResultModel[]) => {
        listConstructorResults = loadConstructorResults;
        if (listConstructorResults.length > 0) {      
        console.log(listConstructorResults[0])
        console.log(listConstructorResults[1])
        console.log(listConstructorResults[2])
        }    
        saveConstructorResultsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading constructorResults from json file
export const loadConstructorResultsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listConstructorResults = jsonFile['constructorResults'];
    if (listConstructorResults.length > 0) {      
        console.log(listConstructorResults[0])
        console.log(listConstructorResults[1])
        console.log(listConstructorResults[2])
    }        
    console.log("Circuits data loaded from json file!");
};

// save ConstructorResultModel[] to json file
export const saveConstructorResultsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {constructorResults: listConstructorResults};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to constructor-results.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external ConstructorResultModel[] to json file
export const saveExtConstructorResultsToJsonFile = async(filePath: string, constructorResultsModel: ConstructorResultModel[]) => {
    try {
        const jsonFile = {constructorResults: constructorResultsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listConstructorResults = constructorResultsModel;

        console.log('JSON data saved to constructor-results.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathConstructorResultsDataJson)) {
    // Load data from json file
    loadConstructorResultsJsonFile(pathConstructorResultsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadConstructorResultsCsvFile(pathConstructorResultsDataCsv, pathConstructorResultsDataJson);
    console.log("File does not exists.");
}