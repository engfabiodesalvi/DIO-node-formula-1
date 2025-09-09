import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { ResultModel } from '../../models/data/result';

export const language = "utf-8";

// Path for csv results file
export const pathResultsDataCsv = path.join(__dirname, "../database/csv/results.csv");
// Path for json results file
export const pathResultsDataJson = path.join(__dirname, "../database/json/results.json");
console.log(pathResultsDataCsv);

// Results data
export let listResults: ResultModel[] = [];

// sorting values through the columns
export async function sortListResults() {
    listResults.sort((a, b) => a.resultId - b.resultId);
}

// load csv to ResultModel[] 
export const loadResults = async(filePath: string): Promise<ResultModel[]> => {
    let results: ResultModel[] = [];         

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
                        resultId: parseInt(data['resultId']) || -1,
                        raceId: parseInt(data['raceId']) || -1,
                        driverId: parseInt(data['driverId']) || -1,
                        constructorId: parseInt(data['constructorId']) || -1,
                        number: parseInt(data['number']) || -1,
                        grid: parseInt(data['grid']) || -1,
                        position: parseInt(data['position']) || -1,
                        positionText: (data['positionText']) === "\\N" ? "" : data['positionText'],
                        positionOrder: parseInt(data['positionOrder']) || -1,
                        points: parseInt(data['points']) || -1,
                        laps: parseInt(data['laps']) || -1,                        
                        time: (data['time']) === "\\N" ? "" : data['time'],
                        milliseconds: parseInt(data['milliseconds']) || -1,                      
                        fastestLap: parseInt(data['fastestLap']) || -1,                      
                        rank: parseInt(data['rank']) || -1,                      
                        fastestLapTime: (data['fastestLapTime']) === "\\N" ? "" : data['fastestLapTime'],
                        fastestLapSpeed: (data['fastestLapSpeed']) === "\\N" ? "" : data['fastestLapSpeed'],
                        statusId: parseInt(data['rank']) || -1
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading results from csv file
export const loadResultsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadResults(filePathCsv)
    .then((loadResults: ResultModel[]) => {
        listResults = loadResults;
        if (listResults.length > 0) {      
        console.log(listResults[0])
        console.log(listResults[1])
        console.log(listResults[2])
        }    
        saveResultsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading results from json file
export const loadResultsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listResults = jsonFile['results'];
    if (listResults.length > 0) {      
        console.log(listResults[0])
        console.log(listResults[1])
        console.log(listResults[2])
    }        
    console.log("Results data loaded from json file!");
};

// save ResultModel[] to json file
export const saveResultsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {results: listResults};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to results.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external ResultModel[] to json file
export const saveExtResultsToJsonFile = async(filePath: string, resultsModel: ResultModel[]) => {
    try {
        const jsonFile = {results: resultsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listResults = resultsModel;

        console.log('JSON data saved to results.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathResultsDataJson)) {
    // Load data from json file
    loadResultsJsonFile(pathResultsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadResultsCsvFile(pathResultsDataCsv, pathResultsDataJson);
    console.log("File does not exists.");
}