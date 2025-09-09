import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { SprintResultModel } from '../../models/data/sprint-result-model';

export const language = "utf-8";

// Path for csv sprintResults file
export const pathSprintResultsDataCsv = path.join(__dirname, "../database/csv/sprint_results.csv");
// Path for json sprintResults file
export const pathSprintResultsDataJson = path.join(__dirname, "../database/json/sprint_results.json");
console.log(pathSprintResultsDataCsv);

// SprintResults data
export let listSprintResults: SprintResultModel[] = [];

// sorting values through the columns
export async function sortListSprintResults() {
    listSprintResults.sort((a, b) => a.resultId - b.resultId);
}

// load csv to SprintResultModel[] 
export const loadSprintResults = async(filePath: string): Promise<SprintResultModel[]> => {
    let sprintResults: SprintResultModel[] = [];         

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
                    .on('data', (data: any) => sprintResults.push({
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
                        fastestLapTime: (data['fastestLapTime']) === "\\N" ? "" : data['fastestLapTime'],
                        statusId: parseInt(data['statusId']) || -1
                    }))
                    .on('end', () => resolve(sprintResults))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        });
   
};

// loading sprint results from csv file
export const loadSprintResultsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadSprintResults(filePathCsv)
    .then((loadSprintResults: SprintResultModel[]) => {
        listSprintResults = loadSprintResults;
        if (listSprintResults.length > 0) {      
        console.log(listSprintResults[0])
        console.log(listSprintResults[1])
        console.log(listSprintResults[2])
        }    
        saveSprintResultsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading sprint results from json file
export const loadSprintResultsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listSprintResults = jsonFile['sprintResults'];
    if (listSprintResults.length > 0) {      
        console.log(listSprintResults[0])
        console.log(listSprintResults[1])
        console.log(listSprintResults[2])
    }        
    console.log("SprintResults data loaded from json file!");
};

// save SprintResultModel[] to json file
export const saveSprintResultsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {sprintResults: listSprintResults};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to sprintResults.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external SprintResultModel[] to json file
export const saveExtSprintResultsToJsonFile = async(filePath: string, sprintResultsModel: SprintResultModel[]) => {
    try {
        const jsonFile = {sprintResults: sprintResultsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listSprintResults = sprintResultsModel;

        console.log('JSON data saved to sprintResults.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathSprintResultsDataJson)) {
    // Load data from json file
    loadSprintResultsJsonFile(pathSprintResultsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadSprintResultsCsvFile(pathSprintResultsDataCsv, pathSprintResultsDataJson);
    console.log("File does not exists.");
}