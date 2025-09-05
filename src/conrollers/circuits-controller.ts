import { FastifyInstance } from "fastify";
import { repositoryListCircuits } from "../repository/circuits/list-circuits-repository";

export const circuitsController = async (server: FastifyInstance) => {

  // GET - List all drivers and Find drivers using query string parameters
  server.get("/circuits",  async (request, response) =>
      await repositoryListCircuits(request, response)
  );  
      
//   // GET - Find drivers by id
//   server.get<{Params: DriverParams}>( "/drivers/id/:driverId",
//     async (request, response) => 
//       await repositoryFindDriverById(request, response)
//   );

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