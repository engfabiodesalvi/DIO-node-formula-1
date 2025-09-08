import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { PitStopModel } from '../../models/data/pit-stop-model';

export const language = "utf-8";

// Path for csv driver standings file
export const pathPitStopsDataCsv = path.join(__dirname, "../database/csv/pit_stops.csv");
// Path for json driver standings file
export const pathPitStopsDataJson = path.join(__dirname, "../database/json/pit-stops.json");
console.log(pathPitStopsDataCsv);

// Pit Stopss data
export let listPitStops: PitStopModel[] = [];

// sorting values through the columns
export async function sortListPitStops() {
    listPitStops.sort((a, b) => {
               
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

// load csv to PitStopModel[] 
export const loadPitStops = async(filePath: string): Promise<PitStopModel[]> => {
    let results: PitStopModel[] = [];         

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
                        stop: parseInt(data['stop']) || 0,
                        lap: parseInt(data['lap']) || 0,
                        time: data['time'],
                        duration: data['duration'],
                        milliseconds: parseInt(data['milliseconds']) || 0
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading pitStops from csv file
export const loadPitStopsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadPitStops(filePathCsv)
    .then((loadPitStops: PitStopModel[]) => {
        listPitStops = loadPitStops;
        if (listPitStops.length > 0) {      
        console.log(listPitStops[0])
        console.log(listPitStops[1])
        console.log(listPitStops[2])
        }    
        savePitStopsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading pitStops from json file
export const loadPitStopsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listPitStops = jsonFile['pitStops'];
    if (listPitStops.length > 0) {      
        console.log(listPitStops[0])
        console.log(listPitStops[1])
        console.log(listPitStops[2])
    }        
    console.log("Pit Stops data loaded from json file!");
};

// save PitStopModel[] to json file
export const savePitStopsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {pitStops: listPitStops};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to driver-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external PitStopModel[] to json file
export const saveExtPitStopsToJsonFile = async(filePath: string, pitStopsModel: PitStopModel[]) => {
    try {
        const jsonFile = {pitStops: pitStopsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing
        //const jsonString = JSON.stringify(jsonFile); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listPitStops = pitStopsModel;

        console.log('JSON data saved to driver-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathPitStopsDataJson)) {
    // Load data from json file
    loadPitStopsJsonFile(pathPitStopsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadPitStopsCsvFile(pathPitStopsDataCsv, pathPitStopsDataJson);
    console.log("File does not exists.");
}