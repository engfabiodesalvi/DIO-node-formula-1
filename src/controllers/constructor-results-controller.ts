import { FastifyInstance } from "fastify";
import { repositoryListConstructorResults } from "../repository/constructor-results/list-constructor-results-repository";
import { ConstructorResultParams } from "../models/params/constructor-result-params-model";
import { repositoryFindConstructorResultById } from "../repository/constructor-results/find-constructor-result-by-id-repository";
import { repositoryDeleteConstructorResultById } from "../repository/constructor-results/delete-constructor-result-by-id-repository";
import { repositoryDeleteConstructorResult } from "../repository/constructor-results/delete-constructor-result-repository";
import { repositoryNewConstructorResult } from "../repository/constructor-results/add-constructor-result-repository";
import { repositoryUpsertConstructorResult } from "../repository/constructor-results/upsert-constructor-result-repository";
import { repositoryEditConstructorResult } from "../repository/constructor-results/edit-constructor-result-repository";

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

  // POST - Create/insert new constructor result
  server.post(
    "/constructor/result",
    async (request, response) =>
      await repositoryNewConstructorResult(request, response)
  );

  // PUT - (Upsert) Edit or insert new constructor result
  server.put(
    "/constructor/result",
    async (request, response) =>
      await repositoryUpsertConstructorResult(request, response)
  );

  // PATCH - Edit a constructor result
  server.patch(
    "/constructor/result",
    async (request, response) => 
    await repositoryEditConstructorResult(request, response)
  );

  // DELETE - Delete a constructor result
  server.delete(
    "/constructor/result",
    async (request, response) =>
      await repositoryDeleteConstructorResult(request, response)
  );

  // DELETE - Delete a constructor result by id
  server.delete<{Params: ConstructorResultParams}>(
    "/constructor/result/id/:constructorResultsId",
    async (request, response) =>
      await repositoryDeleteConstructorResultById(request, response)
  );

}