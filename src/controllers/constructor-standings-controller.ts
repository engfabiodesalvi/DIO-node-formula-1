import { FastifyInstance } from "fastify";
import { ConstructorStandingParams } from "../models/params/constructor-standing-params-model";
import { repositoryNewConstructorStanding } from "../repository/constructor-standings/add-constructor-standing-resitory";
import { repositoryListConstructorStandings } from "../repository/constructor-standings/list-constructor-standing-repository";
import { repositoryFindConstructorStandingById } from "../repository/constructor-standings/find-constructor-standing-by-id-repository";
import { repositoryDeleteConstructorStanding } from "../repository/constructor-standings/delete-constructor-standing-repository";
import { repositoryDeleteConstructorStandingById } from "../repository/constructor-standings/delete-constructor-standing-by-id-repository";
import { repositoryUpsertConstructorStanding } from "../repository/constructor-standings/upsert-constructor-standing-repository";
import { repositoryEditConstructorStanding } from "../repository/constructor-standings/edit-constructor-standing-repository";


export const constructorStandingsController = async (server: FastifyInstance) => {

  // GET - List all constructor standins and Find constructor standins using query string parameters
  server.get("/constructor/standings",  async (request, response) =>
      await repositoryListConstructorStandings(request, response)
  );  
      
  // GET - Find constructor standing by id
  server.get<{Params: ConstructorStandingParams}>( "/constructor/standing/id/:constructorStandingsId",
    async (request, response) => 
      await repositoryFindConstructorStandingById(request, response)
  );

  // POST - Create/insert new constructor standing
  server.post(
    "/constructor/standing",
    async (request, response) =>
      await repositoryNewConstructorStanding(request, response)
  );

  // PUT - (Upsert) Edit or insert new constructor standing
  server.put(
    "/constructor/standing",
    async (request, response) =>
      await repositoryUpsertConstructorStanding(request, response)
  );

  // PATCH - Edit a constructor standing
  server.patch(
    "/constructor/standing",
    async (request, response) => 
    await repositoryEditConstructorStanding(request, response)
  );

  // DELETE - Delete a constructor standing
  server.delete(
    "/constructor/standing",
    async (request, response) =>
      await repositoryDeleteConstructorStanding(request, response)
  );

  // DELETE - Delete a constructor standing by id
  server.delete<{Params: ConstructorStandingParams}>(
    "/constructor/standing/id/:constructorStandingsId",
    async (request, response) =>
      await repositoryDeleteConstructorStandingById(request, response)
  );

}