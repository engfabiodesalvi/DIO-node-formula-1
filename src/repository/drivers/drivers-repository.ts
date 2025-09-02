import * as fs from 'fs';
import * as csv from 'csv-parse';
import { DriversModel } from '../../models/drivers-model';
import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';


// convert csv to json
export const loadDrivers = async(filePath: string): Promise<DriversModel[]> => {
    let results: DriversModel[] = [];         

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
                        driverId: parseInt(data['driverId']) || -1,
                        driverRef: data['driverRef'],
                        number: parseInt(data['number']) || -1,
                        code: (data['code'] == "\\N") ? "" : data['code'],
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

// GET - List all drivers
export const repositoryListDrivers = async (
    request: FastifyRequest,
    response: FastifyReply,
    //listDrivers: DriversModel[]    
) => {
    if (!(listDrivers.length > 0)) {
      response.type("application/json").code(404);
      return { message: "Drivers List Not Found" };
    } else {
      response.type("application/json").code(200);
      return { "drivers": listDrivers };
    }    
}



// Interface used for all methods
interface DriverParams {
  driverId: string;
  forename: string;
}

// Path for csv driver file
const pathData = path.join(__dirname, "../csv/drivers.csv");
console.log(pathData);

// Loading drivers from csv file
let listDrivers: DriversModel[] = [];
loadDrivers(pathData)
  .then((loadDrivers: DriversModel[]) => {
    listDrivers = loadDrivers;
    if (listDrivers.length > 0) {      
      console.log(listDrivers[0])
      console.log(listDrivers[1])
      console.log(listDrivers[2])
    }    
  })
  .catch((error: any) => console.error('Error while converting CSV: ', error));