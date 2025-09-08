import { FastifyInstance } from "fastify";
import { QualifyingParams } from "../models/params/qualifying-params-model";
import { repositoryFindQualifyingById } from "../repository/qualifying/find-qualifying-by-id-repository";
import { repositoryListQualifyings } from "../repository/qualifying/list-qualifyings-repository";
import { repositoryNewQualifying } from "../repository/qualifying/add-qualifying-repository";
import { repositoryUpsertQualifying } from "../repository/qualifying/upsert-qualifying-repository";
import { repositoryDeleteQualifying } from "../repository/qualifying/delete-qualifying-repository";
import { repositoryDeleteQualifyingById } from "../repository/qualifying/delete-qualifying-by-id-repository";
import { repositoryEditQualifying } from "../repository/qualifying/edit-qualifying-repository";

export const qualifyingsController = async (server: FastifyInstance) => {

  // GET - List all pit stops and Find pit stops using query string parameters
  server.get("/qualifyings",  async (request, response) =>
      await repositoryListQualifyings(request, response)
  );  
      
  // GET - Find pit stops by raceId
  server.get<{Params: QualifyingParams}>( "/qualifying/id/:qualifyId",
    async (request, response) => 
      await repositoryFindQualifyingById(request, response)
  );

  // POST - Create/insert new pit stop
  server.post(
    "/qualifying",
    async (request, response) =>
      await repositoryNewQualifying(request, response)
  );

  // PUT - (Upsert) Edit or insert new pit stop
  server.put(
    "/qualifying",
    async (request, response) =>
      await repositoryUpsertQualifying(request, response)
  );

  // PATCH - Edit a pit stop
  server.patch(
    "/qualifying",
    async (request, response) => 
    await repositoryEditQualifying(request, response)
  );

  // DELETE - Delete a pit
  server.delete(
    "/qualifying",
    async (request, response) =>
      await repositoryDeleteQualifying(request, response)
  );

  // DELETE - Delete a pit by raceId, driver Id and pit
  server.delete<{Params: QualifyingParams}>(
    "/qualifying/id/:qualifyId",
    async (request, response) =>
      await repositoryDeleteQualifyingById(request, response)
  );

}
