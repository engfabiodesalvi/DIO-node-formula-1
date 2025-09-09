import { FastifyInstance } from "fastify";
import { ResultParams } from "../models/params/result-params-model";
import { repositoryNewResult } from "../repository/results/add-result-repository";
import { repositoryFindResultById } from "../repository/results/find-result-by-id-repository";
import { repositoryListResults } from "../repository/results/list-results-repository";
import { repositoryUpsertResult } from "../repository/results/upsert-result-repository";
import { repositoryEditResult } from "../repository/results/edit-result-repository";
import { repositoryDeleteResult } from "../repository/results/delete-result-repository";
import { repositoryDeleteResultById } from "../repository/results/delete-result-by-id-repository";


export const resultsController = async (server: FastifyInstance) => {

  // GET - List all results and Find results using query string parameters
  server.get("/results",  async (request, response) =>
      await repositoryListResults(request, response)
  );  
      
  // GET - Find results by resultId
  server.get<{Params: ResultParams}>( "/result/id/:resultId",
    async (request, response) => 
      await repositoryFindResultById(request, response)
  );

  // POST - Create/insert new result
  server.post(
    "/result",
    async (request, response) =>
      await repositoryNewResult(request, response)
  );

  // PUT - (Upsert) Edit or insert new result
  server.put(
    "/result",
    async (request, response) =>
      await repositoryUpsertResult(request, response)
  );

  // PATCH - Edit a result
  server.patch(
    "/result",
    async (request, response) => 
    await repositoryEditResult(request, response)
  );

  // DELETE - Delete a pit
  server.delete(
    "/result",
    async (request, response) =>
      await repositoryDeleteResult(request, response)
  );

  // DELETE - Delete a pit by resultId, driver Id and pit
  server.delete<{Params: ResultParams}>(
    "/result/id/:resultId",
    async (request, response) =>
      await repositoryDeleteResultById(request, response)
  );

}
