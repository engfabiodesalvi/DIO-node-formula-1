import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { CircuitsModel } from '../../models/circuits-model';

export const language = "utf-8";

// Path for csv driver file
export const pathCircuitsDataCsv = path.join(__dirname, "../database/csv/circuits.csv");
// Path for json driver file
export const pathCircuitsDataJson = path.join(__dirname, "../database/json/circuits.json");
console.log(pathCircuitsDataCsv);

// Drivers data
export let listCircuits: CircuitsModel[] = [];

export async function sortListCircuits() {
    listCircuits.sort((a, b) => a.circuitId - b.circuitId);
}

// load csv to CircuitsModel[] 
export const loadCircuits = async(filePath: string): Promise<CircuitsModel[]> => {
    let results: CircuitsModel[] = [];         

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
                        circuitId: parseInt(data['circuitId']) || -1,
                        circuitRef: data['circuitRef'],
                        name: data['name'],
                        location: data['location'],
                        country: data['country'],
                        lat: parseFloat(data['lat']) || 0.0,
                        lng: parseFloat(data['lng']) || 0.0,
                        alt: parseInt(data['alt']) || 0,
                        url: data['url']
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading circuits from csv file
export const loadCircuitsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadCircuits(filePathCsv)
    .then((loadCircuits: CircuitsModel[]) => {
        listCircuits = loadCircuits;
        if (listCircuits.length > 0) {      
        console.log(listCircuits[0])
        console.log(listCircuits[1])
        console.log(listCircuits[2])
        }    
        saveCircuitsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading circuits from json file
export const loadCircuitsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listCircuits = jsonFile['circuits'];
    if (listCircuits.length > 0) {      
        console.log(listCircuits[0])
        console.log(listCircuits[1])
        console.log(listCircuits[2])
    }        
    console.log("Circuits data loaded from json file!");
};

// save CircuitsModel[] to json file
export const saveCircuitsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {circuits: listCircuits};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to circuits.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external CircuitsModel[] to json file
export const saveExtCircuitsToJsonFile = async(filePath: string, circuitsModel: CircuitsModel[]) => {
    try {
        const jsonFile = {circuits: circuitsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listCircuits = circuitsModel;

        console.log('JSON data saved to circuits.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathCircuitsDataJson)) {
    // Load data from json file
    loadCircuitsJsonFile(pathCircuitsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadCircuitsCsvFile(pathCircuitsDataCsv, pathCircuitsDataJson);
    console.log("File does not exists.");
}