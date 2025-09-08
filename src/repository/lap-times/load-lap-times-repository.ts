import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { LapTimeModel } from '../../models/data/lap-time-model';

export const language = "utf-8";

// Path for csv driver standings file
export const pathLapTimesDataCsv = path.join(__dirname, "../database/csv/lap_times.csv");
// Path for json driver standings file
export const pathLapTimesDataJson = path.join(__dirname, "../database/json/lap-times.json");
console.log(pathLapTimesDataCsv);

// Drivers data
export let listLapTimes: LapTimeModel[] = [];

// sorting values through the columns
export async function sortListLapTimes() {
    listLapTimes.sort((a, b) => {
               
        if (a.raceId < b.raceId)
            return -1;

        if (a.raceId > b.raceId)
            return 1; 

        if (a.driverId < b.driverId)
            return -1;

        if (a.driverId > b.driverId)
            return 1;  

        if (a.lap < b.lap)
            return -1;

        if (a.lap > b.lap)
            return 1;          
                       
        return 0;
    });
}

// load csv to LapTimeModel[] 
export const loadLapTimes = async(filePath: string): Promise<LapTimeModel[]> => {
    let results: LapTimeModel[] = [];         

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
                        driverId: parseInt(data['driverId']) || -1,
                        lap: parseInt(data['lap']) || 0,
                        position: parseInt(data['position']) || 0,
                        time: data['time'],
                        milliseconds: parseInt(data['milliseconds']) || 0
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading lapTimes from csv file
export const loadLapTimesCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadLapTimes(filePathCsv)
    .then((loadLapTimes: LapTimeModel[]) => {
        listLapTimes = loadLapTimes;
        if (listLapTimes.length > 0) {      
        console.log(listLapTimes[0])
        console.log(listLapTimes[1])
        console.log(listLapTimes[2])
        }    
        saveLapTimesToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading lapTimes from json file
export const loadLapTimesJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listLapTimes = jsonFile['lapTimes'];
    if (listLapTimes.length > 0) {      
        console.log(listLapTimes[0])
        console.log(listLapTimes[1])
        console.log(listLapTimes[2])
    }        
    console.log("Lap Times data loaded from json file!");
};

// save LapTimeModel[] to json file
export const saveLapTimesToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {lapTimes: listLapTimes};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to lap-times.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external LapTimeModel[] to json file
export const saveExtLapTimesToJsonFile = async(filePath: string, lapTimesModel: LapTimeModel[]) => {
    try {
        const jsonFile = {lapTimes: lapTimesModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listLapTimes = lapTimesModel;

        console.log('JSON data saved to lap-times.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathLapTimesDataJson)) {
    // Load data from json file
    loadLapTimesJsonFile(pathLapTimesDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadLapTimesCsvFile(pathLapTimesDataCsv, pathLapTimesDataJson);
    console.log("File does not exists.");
}