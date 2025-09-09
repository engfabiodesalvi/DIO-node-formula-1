import { FastifyInstance } from "fastify";
import { SprintResultParams } from "../models/params/sprint-result-params-model";
import { repositoryListSprintResults } from "../repository/sprint-results/list-sprint-results-repository";
import { repositoryNewSprintResult } from "../repository/sprint-results/add-sprint-result-repository";
import { repositoryDeleteSprintResult } from "../repository/sprint-results/delete-sprint-result-repository";
import { repositoryEditSprintResult } from "../repository/sprint-results/edit-sprint-result-repository";
import { repositoryFindSprintResultById } from "../repository/sprint-results/find-sprint-result-by-id-repository";
import { repositoryUpsertSprintResult } from "../repository/sprint-results/upsert-sprint-result-repository";
import { repositoryDeleteSprintResultById } from "../repository/sprint-results/delete-sprint-result-by-id-repository";

export const sprintResultsController = async (server: FastifyInstance) => {

  // GET - List all sprint results and Find sprint results using query string parameters
  server.get("/sprint/results",  async (request, response) =>
      await repositoryListSprintResults(request, response)
  );  
      
  // GET - Find sprint result by resultId
  server.get<{Params: SprintResultParams}>( "/sprint/result/id/:resultId",
    async (request, response) => 
      await repositoryFindSprintResultById(request, response)
  );

  // POST - Create/insert new sprint result
  server.post(
    "/sprint/result",
    async (request, response) =>
      await repositoryNewSprintResult(request, response)
  );

  // PUT - (Upsert) Edit or insert new sprint result
  server.put(
    "/sprint/result",
    async (request, response) =>
      await repositoryUpsertSprintResult(request, response)
  );

  // PATCH - Edit a sprint result
  server.patch(
    "/sprint/result",
    async (request, response) => 
    await repositoryEditSprintResult(request, response)
  );

  // DELETE - Delete a sprint result
  server.delete(
    "/sprint/result",
    async (request, response) =>
      await repositoryDeleteSprintResult(request, response)
  );

  // DELETE - Delete a sprint result by year
  server.delete<{Params: SprintResultParams}>(
    "/sprint/result/id/:resultId",
    async (request, response) =>
      await repositoryDeleteSprintResultById(request, response)
  );

}
