import * as fs from 'fs';
import * as csv from 'csv-parse';
import { DriversModel } from '../models/driver-model';

// blueprint function - changes for other cases
export const convertCsvToJson = async(filePath: string): Promise<DriversModel[]> => {
    let results: DriversModel[] = [];         

    const readCsvFile = fs.createReadStream(filePath);

    // checking that there were no errors opening the file.
    readCsvFile
        .on('error', (error: any) => {
            console.error('An error occurred while opening the file:', error);
        });


    return  new Promise<DriversModel[]>((resolve, reject) => {
        readCsvFile                  
            .pipe(csv.parse( {
                columns: true, // Treat the first row as column headers (keys)
            }))
            .on('data', (data: any) => results.push({
                driverId: parseInt(data['driverId']) || -1,
                driverRef: data['driverRef'],
                number: parseInt(data['number']) || -1,
                code: data['code'],
                forename: data['forename'],
                surname: data['surname'],
                dob: data['dob'],
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

// use this methos to call convertCsvToJson

// convertCsvToJson(pathData)
//   .then(driversData => {
//     console.log(driversData[0]);
//     console.log(driversData[1]);
//     console.log(driversData[2]);
//   })