import * as fs from 'fs';
import fsPromises from "fs/promises";
import * as csv from 'csv-parse';
import { DriverModel } from '../../models/driver-model';
import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { DriverParams } from '../../models/driver-parameters-model';
import { fileURLToPath } from 'url';

const language = "utf-8";

// Path for csv driver file
const pathDataCsv = path.join(__dirname, "../csv/drivers.csv");
// Path for json driver file
const pathDataJson = path.join(__dirname, "../json/drivers.json");
console.log(pathDataCsv);

// Drivers data
let listDrivers: DriverModel[] = [];

// load csv to DriversModel[] 
export const loadDrivers = async(filePath: string): Promise<DriverModel[]> => {
    let results: DriverModel[] = [];         

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

// loading drivers from csv file
export const loadDriversCsvFile = async(filePathCsv: string, filePathJson: string) => {
    await loadDrivers(filePathCsv)
    .then((loadDrivers: DriverModel[]) => {
        listDrivers = loadDrivers;
        if (listDrivers.length > 0) {      
        console.log(listDrivers[0])
        console.log(listDrivers[1])
        console.log(listDrivers[2])
        }    
        saveDriversToJsonFile(filePathJson);
    })
    .catch((error: any) => console.error('Error while converting CSV: ', error));
}

// lading drives from json file
export const loadDriversJsonFile = async(filePathJson: string) => {
  
    const rawData = fs.readFileSync(filePathJson, language);
    const jsonFile = JSON.parse(rawData);
    listDrivers = jsonFile['drivers'];
    if (listDrivers.length > 0) {      
        console.log(listDrivers[0])
        console.log(listDrivers[1])
        console.log(listDrivers[2])
    }        
    console.log("Drivers data loaded from json file!");
};

// save DriversModel[] to json file
export const saveDriversToJsonFile = async(filePath: string) => {
    try {
        const jsonFile = {drivers: listDrivers};
        const jsonString = JSON.stringify(jsonFile, null, 2); // Stringify with pretty-printing

        // update de file
        await fsPromises.writeFile(filePath, jsonString, language);

        console.log('JSON data saved to drivers.json');  
  } catch (error) {
    console.error(`Error performing file operations: ${error}`);
  }                  
};

// GET - List all drivers and Find drivers using query parameters
export const repositoryListDrivers = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    // reading the drivers values
    const { 
        driverId, driverRef, number, code, forename,
        surname, dob, nationality, url 
    } = request.query as any;

    // To verify sended values
    // console.log(JSON.stringify({
    //     driverId, driverRef, number, code, forename,
    //     surname, dob, nationality, url 
    // }, null, 2));
    // console.log(JSON.stringify(request.query, null, 2));    
    console.log(JSON.stringify(request.body, null, 2)); 

    //console.log(`${typeof(driverId) === 'string'}`)
    const drivers = listDrivers.filter((driverItem) => {
       let allMatch = true;
        
       // Comparing values

        if (parseInt(driverId) > 0) {
            if (!(driverItem.driverId === parseInt(driverId))) {
                allMatch = false;
            }
        }

        if (driverRef?.length > 0) {
            if(!(driverItem.driverRef.includes(driverRef))) {
                allMatch = false;
            }
        }

        if (parseInt(number) > 0) {
            if (!(driverItem.number === parseInt(number))) {
                allMatch = false;
            }
        }

        if (code?.length > 0) {
            if(!(driverItem.code.includes(code))) {
                allMatch = false;
            }
        }     
        
        if (forename?.length > 0) {
            if(!(driverItem.forename.includes(forename))) {
                allMatch = false;
            }
        }         

        if (surname?.length > 0) {
            if(!(driverItem.surname.includes(surname))) {
                allMatch = false;
            }
        }  

        if (dob?.length > 0) {
            if(!(driverItem.dob.includes(dob))) {
                allMatch = false;
            }
        }          

        if (nationality?.length > 0) {
            if(!(driverItem.nationality.includes(nationality))) {
                allMatch = false;
            }
        }   
        
        if (url?.length > 0) {
            if(!(driverItem.url.includes(url))) {
                allMatch = false;
            }
        }           

        return allMatch;
    });


    if (!(drivers.length > 0)) {
        response.type("application/json").code(404);
        return { message: "Driver Not Found" };
    } else {
        response.type("application/json").code(200);
        return { drivers };
    }  

};

// GET - Find driver by Id
export const repositoryFindDriverById = async (
    request: FastifyRequest,
    response: FastifyReply,      
) => {
    // partially initialized variable
    let driver:Partial<DriverModel> = {};
    if (listDrivers.length > 0) { 
        const driverParams = request.params as DriverParams;
        const driverId = parseInt(driverParams.driverId) || 0;
        driver = listDrivers.find((driverItem) => {              
            if (driverId > 0) {
                if (!(driverItem.driverId === driverId)) {
                    console.info(`${driverItem.driverId} - ${driverId}`);
                    return false;            
                } else {
                return true;
                }
            }
        }) as DriverModel;
    }

    if (!(driver)) {
        response.type("application/json").code(404);
        return { message: "Driver Not Found" };
    } else {
        response.type("application/json").code(200);
        return { "driver": driver };
    }   
};

// POST - Create/insert new driver
export const repositoryNewDriver = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;
    const newDriver = reqBody['newDriver'] as DriverModel;
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // find new driver id in database
            let findDriver = listDrivers.filter(
                (itemDriver)=> itemDriver.driverId === newDriver.driverId);

            // insert new item if no results match
            if (findDriver.length === 0) { 
                // const lastIndex = listDrivers.lastIndexOf(
                //     itemDriver => itemDriver.driverId < newDriver.driverId);              
                listDrivers.push(newDriver);

                // verify if new item was inserted
                findDriver = listDrivers.filter(
                    (itemDriver)=> itemDriver.driverId === newDriver.driverId);
                
                // if ok return the item                    
                if (findDriver.length === 1) {
                    response.type("application/json").code(200);
                    return {"newDriver": findDriver};
                }
            } else {
                // driver alredy inserted.
                response.type("application/json").code(409);
                return {
                    "message": `[driverId: ${newDriver.driverId}] já cadastrado!`,
                    "newDriver": newDriver};
            }

            //return {"message": "Bearer Token ok!", newDriver};
        } else {
            response.type("application/json").code(401);
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401);
        return {"message": "Missing Bearer Token."};
    }


    return request.headers.authorization;
}


// Load data from json file or create json file from csv file.
if (fs.existsSync(pathDataJson)) {
    loadDriversJsonFile(pathDataJson)
    console.log("File exists.");
} else {
    loadDriversCsvFile(pathDataCsv, pathDataJson);
    console.log("File does not exists.");
}