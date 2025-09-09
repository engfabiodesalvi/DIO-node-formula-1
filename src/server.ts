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
import { qualifyingsController } from "./controllers/qualifyings-controller";
import { resultsController } from "./controllers/results-controller";
import { racesController } from "./controllers/races-controller copy";
import { seasonsController } from "./controllers/seasons-controller";
import { sprintResultsController } from "./controllers/sprint-results-controller";

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

// Qualifyings Rest HTTP methods
qualifyingsController(server);

// Races Rest HTTP methods
racesController(server);

// Results Rest HTTP methods
resultsController(server);

// Seasons Rest HTTP methods
seasonsController(server);

// Seasons Rest HTTP methods
sprintResultsController(server);

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
