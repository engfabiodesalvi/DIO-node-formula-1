import fastify from "fastify";
import cors from "@fastify/cors";

import { driversController } from "./controllers/drivers-controller";
import { circuitsController } from "./controllers/circuits-controller";
import { constructorResultsController } from "./controllers/constructor-results-controller";
import { constructorStandingsController } from "./controllers/constructor-standings-controller";
import { constructorController } from "./controllers/constructor-controller";
import { driverStandingsController } from "./controllers/drivers-standings-controller";
import { lapTimesController } from "./controllers/lap-times-controller";
import { pitStopsController } from "./controllers/pit-stops-controller";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});



// Circuits Rest HTTP methods
circuitsController(server);

// Constructor Results Rest HTTP methods
constructorResultsController(server);

// Constructor Standings Rest HTTP methods
constructorStandingsController(server);

// Constructor Rest HTTP methods
constructorController(server);

// Drivers Rest HTTP methods
driversController(server);

// Driver Standings Rest HTTP methods
driverStandingsController(server);

// Lap Times Rest HTTP methods
lapTimesController(server);

// Pit Stops Rest HTTP methods
pitStopsController(server);

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
