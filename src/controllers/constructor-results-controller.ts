import { FastifyInstance } from "fastify";
import { repositoryListConstructorResults } from "../repository/constructor-results/list-constructor-results-repository";
import { ConstructorResultParams } from "../models/params/constructor-result-params-model";
import { repositoryFindConstructorResultById } from "../repository/constructor-results/find-constructor-result-by-id-repository";

export const constructorResultsController = async (server: FastifyInstance) => {

  // GET - List all constructor results and Find constructor results using query string parameters
  server.get("/constructor/results",  async (request, response) =>
      await repositoryListConstructorResults(request, response)
  );  
      
  // GET - Find constructor result by id
  server.get<{Params: ConstructorResultParams}>( "/constructor/result/id/:constructorResultsId",
    async (request, response) => 
      await repositoryFindConstructorResultById(request, response)
  );

//   // POST - Create/insert new constructor result
//   server.post(
//     "/circuit",
//     async (request, response) =>
//       await repositoryNewCircuit(request, response)
//   );

//   // PUT - (Upsert) Edit or insert new constructor result
//   server.put(
//     "/circuit",
//     async (request, response) =>
//       await repositoryUpsertCircuit(request, response)
//   );

//   // PATCH - Edit a constructor result
//   server.patch(
//     "/circuit",
//     async (request, response) => 
//     await repositoryEditCircuit(request, response)
//   );

//   // DELETE - Delete a constructor result
//   server.delete(
//     "/circuit",
//     async (request, response) =>
//       await repositoryDeleteCircuit(request, response)
//   );

//   // DELETE - Delete a constructor result by id
//   server.delete<{Params: CircuitParams}>(
//     "/circuit/id/:circuitId",
//     async (request, response) =>
//       await repositoryDeleteCircuitById(request, response)
//   );

}