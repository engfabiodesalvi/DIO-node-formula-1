import fastify from "fastify";
import cors from "@fastify/cors";
import { convertCsvToJson } from "./utils/csv-to-json";

import path from "path";

import { DriverModel } from "./models/driver-model";
import { DriverParams } from "./models/driver-parameters-model";
import { repositoryNewDriver } from "./repository/drivers/add-driver-repository";
import { repositoryListDrivers } from "./repository/drivers/list-drivers-repository";
import { repositoryDeleteDriver } from "./repository/drivers/delete-driver-repositry";
import { repositoryFindDriverById } from "./repository/drivers/find-drivers-id-repository";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

//
// ## Drivers REST HTTP Methods
//
// GET - List all drivers and Find drivers using query string parameters
server.get("/drivers",  async (request, response) =>
    await repositoryListDrivers(request, response)
);   

// GET - Find drivers by id
server.get<{ Params: DriverParams }>( "/drivers/id/:driverId",
  async (request, response) => 
    await repositoryFindDriverById(request, response)
);

// POST - Create/insert new driver
server.post(
  "/driver",
  async (request, response) =>
    await repositoryNewDriver(request, response)
);

// DELETE - Delete a driver
server.delete(
  "/driver",
  async (request, response) =>
    await repositoryDeleteDriver(request, response)
)

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
