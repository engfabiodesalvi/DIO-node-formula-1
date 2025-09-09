
import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import path from 'path';
import { SeasonModel } from '../../models/data/season';

export const language = "utf-8";

// Path for csv season file
export const pathSeasonsDataCsv = path.join(__dirname, "../database/csv/seasons.csv");
// Path for json season file
export const pathSeasonsDataJson = path.join(__dirname, "../database/json/seasons.json");
console.log(pathSeasonsDataCsv);

// Seasons data
export let listSeasons: SeasonModel[] = [];

export async function sortListSeasons() {
    listSeasons.sort((a, b) => a.year - b.year);
}

// load csv to SeasonsModel[] 
export const loadSeasons = async(filePath: string): Promise<SeasonModel[]> => {
    let results: SeasonModel[] = [];         

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
                        year: parseInt(data['year']) || -1,
                        url: data['url']
                    }))
                    .on('end', () => resolve(results))
                    .on('error', (error: any) => {
                        console.error('An error occurred while parsing file:', error);
                        reject(error)
                    });
        }); 
   
};

// loading seasons from csv file
export const loadSeasonsCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadSeasons(filePathCsv)
    .then((loadSeasons: SeasonModel[]) => {
        listSeasons = loadSeasons;
        if (listSeasons.length > 0) {      
        console.log(listSeasons[0])
        console.log(listSeasons[1])
        console.log(listSeasons[2])
        }    
        saveSeasonsToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// loading drives from json file
export const loadSeasonsJsonFile = async(filePathJson: string) => {
  
    const rawData = fsPromises.readFile(filePathJson, language);
    const jsonFile = JSON.parse(await rawData);
    listSeasons = jsonFile['seasons'];
    if (listSeasons.length > 0) {      
        console.log(listSeasons[0])
        console.log(listSeasons[1])
        console.log(listSeasons[2])
    }        
    console.log("Seasons data loaded from json file!");
};

// save SeasonsModel[] to json file
export const saveSeasonsToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {seasons: listSeasons};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to seasons.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// save external SeasonsModel[] to json file
export const saveExtSeasonsToJsonFile = async(filePath: string, seasonsModel: SeasonModel[]) => {
    try {
        const jsonFile = {seasons: seasonsModel};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);
        
        listSeasons = seasonsModel;

        console.log('JSON data saved to seasons.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
}

// Verify if json file exists!
if (fs.existsSync(pathSeasonsDataJson)) {
    // Load data from json file
    loadSeasonsJsonFile(pathSeasonsDataJson)
    console.log("File exists.");
} else {
    // Create json file from csv file.
    loadSeasonsCsvFile(pathSeasonsDataCsv, pathSeasonsDataJson);
    console.log("File does not exists.");
}