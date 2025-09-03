import fastify from "fastify";
import cors from "@fastify/cors";
import { convertCsvToJson } from "./utils/csv-to-json";

import path from "path";

import { DriverModel } from "./models/driver-model";
import { repositoryFindDriverById, repositoryListDrivers, repositoryNewDriver } from "./repository/drivers/drivers-repository";
import { DriverParams } from "./models/driver-parameters-model";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

// const teams = [
//   { id: 1, name: "McLaren", base: "Woking, United Kingdom" },
//   { id: 2, name: "Mercedes", base: "Brackley, United Kingdom" },
//   { id: 3, name: "Red Bull Racing", base: "Milton Keynes, United Kingdom" },
//   { id: 4, name: "Ferrari", base: "Maranello, Italy" },
//   { id: 5, name: "Alpine", base: "Enstone, United Kingdom" },
//   { id: 6, name: "Aston Martin", base: "Silverstone, United Kingdom" },
//   { id: 7, name: "Alfa Romeo Racing", base: "Hinwil, Switzerland" },
//   { id: 8, name: "AlphaTauri", base: "Faenza, Italy" },
//   { id: 9, name: "Williams", base: "Grove, United Kingdom" },
//   { id: 10, name: "Haas", base: "Kannapolis, United States" },
//   { id: 11, name: "Uralkali Haas F1 Team", base: "Banbury, United Kingdom" },
//   { id: 12, name: "Scuderia Toro Rosso", base: "Faenza, Italy" },
// ];

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

 

// server.get("/teams", async (request, response) => {  
//   response.type("application/json").code(200);
//   return { teams };
// });

//
// ## Drivers REST HTTP Methos
//

// GET - List all drivers and Find drivers using query string parameters
server.get("/drivers",  async (request, response) =>
    await repositoryListDrivers(request, response)
);   

// GET - Find drivers by id
server.get<{ Params: DriverParams }>(
  "/drivers/id/:driverId",
  async (request, response) => 
    await repositoryFindDriverById(request, response)
);

// POST - Create/insert new driver
server.post(
  "/driver",
  async (request, response) =>
    await repositoryNewDriver(request, response)
);

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});


''
