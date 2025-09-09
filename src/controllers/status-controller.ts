import { StatusParams } from "../models/params/status-params-model";
import { repositoryFindStatusById } from "../repository/status/find-status-id-repository";
import { repositoryUpsertStatus } from "../repository/status/upsert-status-repository";
import { repositoryEditStatus } from "../repository/status/edit-status-repository";
import { repositoryDeleteStatusById } from "../repository/status/delete-status-by-id-repository";
import { repositoryListStatus } from "../repository/status/list-status-repository";
import { FastifyInstance } from "fastify";
import { repositoryDeleteStatus } from "../repository/status/delete-status-repositry";
import { repositoryNewStatus } from "../repository/status/add-status-repository";

export const statusController = async (server: FastifyInstance) => {

  // GET - List all status and Find status using query string parameters
  server.get("/status",  async (request, response) =>
      await repositoryListStatus(request, response)
  );  
      
  // GET - Find status by statusId
  server.get<{Params: StatusParams}>( 
    "/status/id/:statusId",
    async (request, response) => 
      await repositoryFindStatusById(request, response)
  );

  // POST - Create/insert new status
  server.post(
    "/status",
    async (request, response) =>
      await repositoryNewStatus(request, response)
  );

  // PUT - (Upsert) Edit or insert new status
  server.put(
    "/status",
    async (request, response) =>
      await repositoryUpsertStatus(request, response)
  );

  // PATCH - Edit a status
  server.patch(
    "/status",
    async (request, response) => 
    await repositoryEditStatus(request, response)
  );

  // DELETE - Delete a status
  server.delete(
    "/status",
    async (request, response) =>
      await repositoryDeleteStatus(request, response)
  );

  // DELETE - Delete a status by year
  server.delete<{Params: StatusParams}>(
    "/status/id/:statusId",
    async (request, response) =>
      await repositoryDeleteStatusById(request, response)
  );

}


