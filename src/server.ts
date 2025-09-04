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
import { repositoryUpsertDriver } from "./repository/drivers/upsert-drivers-repositry";
import { repositoryEditDriver } from "./repository/drivers/edit-driver-repository";
import { driversController } from "./conrollers/drivers-controller";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

//
// ## Drivers REST HTTP Methods
//
driversController(server);


server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
