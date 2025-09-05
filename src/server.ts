import fastify from "fastify";
import cors from "@fastify/cors";

import { driversController } from "./conrollers/drivers-controller";
import { circuitsController } from "./conrollers/circuits-controller";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

// Circuits Rest HTTP methods
circuitsController(server);

// Drivers Rest HTTP methods
driversController(server);


server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
