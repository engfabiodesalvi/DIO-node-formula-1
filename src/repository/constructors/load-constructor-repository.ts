import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { ConstructorModel } from '../../models/data/constructor';


export const language = "utf-8";

// Path for csv constructor file
export const pathConstructorsDataCsv = path.join(__dirname, "../database/csv/constructors.csv");
// Path for json constructor file
export const pathConstructorsDataJson = path.join(__dirname, "../database/json/constructors.json");
console.log(pathConstructorsDataCsv);

// Drivers data
export let listConstructors: ConstructorModel[] = [];

export async function sortListConstructors() {
    listConstructors.sort((a, b) => a.constructorId - b.constructorId);
}

// load csv to ConstructorModel[] 
export const loadConstructors = async(filePath: string): Promise<ConstructorModel[]> => {
    let results: ConstructorModel[] = [];         

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
                        constructorId: parseInt(data['constructorId']) || -1,
                        constructorRef: data['constructorRef'],
                        name: data['name'],
                        nationality: data['nationality'],
                        url: data['url']
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading constructors from csv file
export const loadConstructorsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadConstructors(filePathCsv)
    .then((loadConstructors: ConstructorModel[]) => {
        listConstructors = loadConstructors;
        if (listConstructors.length > 0) {      
        console.log(listConstructors[0])
        console.log(listConstructors[1])
        console.log(listConstructors[2])
        }    
        saveConstructorsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading constructors from json file
export const loadConstructorsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listConstructors = jsonFile['constructors'];
    if (listConstructors.length > 0) {      
        console.log(listConstructors[0])
        console.log(listConstructors[1])
        console.log(listConstructors[2])
    }        
    console.log("Constructor Standings data loaded from json file!");
};

// save ConstructorModel[] to json file
export const saveConstructorsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {constructors: listConstructors};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to constructor-standins.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external ConstructorModel[] to json file
export const saveExtConstructorsToJsonFile = async(filePath: string, constructorsModel: ConstructorModel[]) => {
    try {
        const jsonFile = {constructors: constructorsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listConstructors = constructorsModel;

        console.log('JSON data saved to constructor-standings.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathConstructorsDataJson)) {
    // Load data from json file
    loadConstructorsJsonFile(pathConstructorsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadConstructorsCsvFile(pathConstructorsDataCsv, pathConstructorsDataJson);
    console.log("File does not exists.");
}