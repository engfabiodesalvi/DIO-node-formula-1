
import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { StatusModel } from '../../models/data/status-model';

export const language = "utf-8";

// Path for csv season file
export const pathStatusDataCsv = path.join(__dirname, "../database/csv/status.csv");
// Path for json season file
export const pathStatusDataJson = path.join(__dirname, "../database/json/status.json");
console.log(pathStatusDataCsv);

// Status data
export let listStatus: StatusModel[] = [];

export async function sortListStatus() {
    listStatus.sort((a, b) => a.statusId - b.statusId);
}

// load csv to StatusModel[] 
export const loadStatus = async(filePath: string): Promise<StatusModel[]> => {
    let statusList: StatusModel[] = [];         

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
                    .on('data', (data: any) => statusList.push({
                        statusId: parseInt(data['statusId']) || -1,
                        status: data['status']
                    }))
                    .on('end', () => resolve(statusList))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading status from csv file
export const loadStatusCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadStatus(filePathCsv)
    .then((loadStatus: StatusModel[]) => {
        listStatus = loadStatus;
        if (listStatus.length > 0) {      
        console.log(listStatus[0])
        console.log(listStatus[1])
        console.log(listStatus[2])
        }    
        saveStatusToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading drives from json file
export const loadStatusJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listStatus = jsonFile['status'];
    if (listStatus.length > 0) {      
        console.log(listStatus[0])
        console.log(listStatus[1])
        console.log(listStatus[2])
    }        
    console.log("Status data loaded from json file!");
};

// save StatusModel[] to json file
export const saveStatusToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {status: listStatus};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to status.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external StatusModel[] to json file
export const saveExtStatusToJsonFile = async(filePath: string, statusModel: StatusModel[]) => {
    try {
        const jsonFile = {status: statusModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listStatus = statusModel;

        console.log('JSON data saved to status.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathStatusDataJson)) {
    // Load data from json file
    loadStatusJsonFile(pathStatusDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadStatusCsvFile(pathStatusDataCsv, pathStatusDataJson);
    console.log("File does not exists.");
}