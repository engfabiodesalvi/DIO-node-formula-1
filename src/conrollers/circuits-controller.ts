import { FastifyInstance } from "fastify";
import { repositoryListCircuits } from "../repository/circuits/list-circuits-repository";
import { CircuitsParams } from "../models/circuit-parameters-model";
import { repositoryFindCircuitById } from "../repository/circuits/find-circuit-by-id-repository";

export const circuitsController = async (server: FastifyInstance) => {

  // GET - List all circuits and Find circuits using query string parameters
  server.get("/circuits",  async (request, response) =>
      await repositoryListCircuits(request, response)
  );  
      
  // GET - Find circuits by id
  server.get<{Params: CircuitsParams}>( "/circuits/id/:circuitId",
    async (request, response) => 
      await repositoryFindCircuitById(request, response)
  );

//   // POST - Create/insert new driver
//   server.post(
//     "/driver",
//     async (request, response) =>
//       await repositoryNewDriver(request, response)
//   );

//   // PUT - (Upsert) Edit or insert new driver
//   server.put(
//     "/driver",
//     async (request, response) =>
//       await repositoryUpsertDriver(request, response)
//   );

//   // PATCH - Edit a driver
//   server.patch(
//     "/driver",
//     async (request, response) => 
//     await repositoryEditDriver(request, response)
//   );

//   // DELETE - Delete a driver
//   server.delete(
//     "/driver",
//     async (request, response) =>
//       await repositoryDeleteDriver(request, response)
//   );

//   // DELETE - Delete a driver by id
//   server.delete<{Params: DriverParams}>(
//     "/driver/id/:driverId",
//     async (request, response) =>
//       await repositoryDeleteDriverById(request, response)
//   );

}