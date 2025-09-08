import { FastifyInstance } from "fastify";
import { RaceParams } from "../models/params/race-params-model";
import { repositoryListRaces } from "../repository/races/list-races-repository";
import { repositoryFindRaceById } from "../repository/races/find-race-by-id-repository";
import { repositoryNewRace } from "../repository/races/add-race-repository";
import { repositoryUpsertRace } from "../repository/races/upsert-race-repository";
import { repositoryEditRace } from "../repository/races/edit-race-repository";
import { repositoryDeleteRace } from "../repository/races/delete-race-repository";
import { repositoryDeleteRaceById } from "../repository/races/delete-race-by-id-repository";

export const racesController = async (server: FastifyInstance) => {

  // GET - List all pit stops and Find pit stops using query string parameters
  server.get("/races",  async (request, response) =>
      await repositoryListRaces(request, response)
  );  
      
  // GET - Find pit stops by raceId
  server.get<{Params: RaceParams}>( "/race/id/:raceId",
    async (request, response) => 
      await repositoryFindRaceById(request, response)
  );

  // POST - Create/insert new pit stop
  server.post(
    "/race",
    async (request, response) =>
      await repositoryNewRace(request, response)
  );

  // PUT - (Upsert) Edit or insert new pit stop
  server.put(
    "/race",
    async (request, response) =>
      await repositoryUpsertRace(request, response)
  );

  // PATCH - Edit a pit stop
  server.patch(
    "/race",
    async (request, response) => 
    await repositoryEditRace(request, response)
  );

  // DELETE - Delete a pit
  server.delete(
    "/race",
    async (request, response) =>
      await repositoryDeleteRace(request, response)
  );

  // DELETE - Delete a pit by raceId, driver Id and pit
  server.delete<{Params: RaceParams}>(
    "/race/id/:raceId",
    async (request, response) =>
      await repositoryDeleteRaceById(request, response)
  );

}
