import fastify from "fastify";
import cors from "@fastify/cors";

import { driversController } from "./controllers/drivers-controller";
import { circuitsController } from "./controllers/circuits-controller";
import { constructorResultsController } from "./controllers/constructor-results-controller";
import { constructorStandingsController } from "./controllers/constructor-standings-controller";

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

// Drivers Rest HTTP methods
driversController(server);


server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
