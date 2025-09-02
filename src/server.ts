import fastify from "fastify";
import cors from "@fastify/cors";
import { convertCsvToJson } from "./utils/csv-to-json";

import path from "path";

import { DriversModel } from "./models/drivers-model";
import { loadDrivers, repositoryListDrivers } from "./repository/drivers/drivers-repository";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

const teams = [
  { id: 1, name: "McLaren", base: "Woking, United Kingdom" },
  { id: 2, name: "Mercedes", base: "Brackley, United Kingdom" },
  { id: 3, name: "Red Bull Racing", base: "Milton Keynes, United Kingdom" },
  { id: 4, name: "Ferrari", base: "Maranello, Italy" },
  { id: 5, name: "Alpine", base: "Enstone, United Kingdom" },
  { id: 6, name: "Aston Martin", base: "Silverstone, United Kingdom" },
  { id: 7, name: "Alfa Romeo Racing", base: "Hinwil, Switzerland" },
  { id: 8, name: "AlphaTauri", base: "Faenza, Italy" },
  { id: 9, name: "Williams", base: "Grove, United Kingdom" },
  { id: 10, name: "Haas", base: "Kannapolis, United States" },
  { id: 11, name: "Uralkali Haas F1 Team", base: "Banbury, United Kingdom" },
  { id: 12, name: "Scuderia Toro Rosso", base: "Faenza, Italy" },
];

// const drivers = [
//   { id: 1, name: "Max Verstappen", team: "Red Bull Racing" },
//   { id: 2, name: "Lewis Hamilton", team: "Ferrari" },
//   { id: 2, name: "Lando Norris", team: "McLaren" },
// ];
// const pathData = path.join(__dirname, "./repository/csv/drivers.csv");
// console.log(pathData);

// // loading drivers from csv file
// let drivers: DriversModel[] = [];
// loadDrivers(pathData)
//   .then((loadDrivers: DriversModel[]) => {
//     drivers = loadDrivers;
//     // if (drivers.length > 0) {
//     //   console.log(drivers[0])
//     //   console.log(drivers[1])
//     //   console.log(drivers[2])
//     // }    
//   })
//   .catch((error: any) => console.error('Error while converting CSV: ', error));

 

server.get("/teams", async (request, response) => {  
  response.type("application/json").code(200);
  return { teams };
});




// // GET - Find drivers by id
// server.get<{ Params: DriverParams }>(
//   "/drivers/id/:driverId",
//   async (request, response) => {   
//     // partially initialized variable
//     let driver:Partial<DriversModel> = {};
//     if (drivers.length > 0) { 
//       const driverId = parseInt(request.params.driverId) || 0;
//       driver = drivers.find((driver) => {      
        
//         if (driverId > 0) {
//           if (!(driver.driverId === driverId)) {
//             return false;
//             //console.info(`${d.driverId} - ${driverId}`);
//           } else {
//             return true;
//           }
//         }
//       }) as DriversModel;
//     }

//     if (!(driver)) {
//       response.type("application/json").code(404);
//       return { message: "Driver Not Found" };
//     } else {
//       response.type("application/json").code(200);
//       return { "drivers": driver };
//     }
//   }
// );

// // GET - Find drivers using query string parameters
// server.get<{ Params: DriverParams }>(
//   "/drivers/find",
//   async (request, response) => {
//     //console.log(JSON.stringify(request.query));    
//     //const queryKeys = [];
//     for (const key in request.query as any) {
//       if (Object.prototype.hasOwnProperty.call(request.query, key)) { // Important for safety
//         //queryKeys.push(key);      
//       }
//     }
//     //console.log('All query keys:', queryKeys);
//     const driverId = parseInt(request.params.driverId) || 0;
//     //const forename = request.params.forename || "";
//     const driver = drivers.filter((driver) => {
//       //let allMatch = true;
      
//       if (driverId > 0) {
//         if (!(driver.driverId === driverId)) {
//           return false;
//           //console.info(`${d.driverId} - ${driverId}`);
//         } else {
//           return true;
//         }
//       }

//       // if (forename.length > 0) {
//       //   if (!(d.forename.includes(forename))) {
//       //     allMatch = false;
//       //     console.log(`${d.forename} - ${forename} - ${d.forename.includes(forename)} - ${forename !== ""}`);
//       //   }
//       // }

//       //return allMatch;
//     });


//     if (!driver) {
//       response.type("application/json").code(404);
//       return { message: "Driver Not Found" };
//     } else {
//       response.type("application/json").code(200);
//       return { driver };
//     }
//   }
// );

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});



