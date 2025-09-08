import { FastifyInstance } from "fastify";
import { PitStopParams } from "../models/params/pit-stop-params-model";
import { repositoryListPitStops } from "../repository/pit-stops/list-pit-stops-repository";
import { repositoryFindPitStopsById } from "../repository/pit-stops/find-pit-stops-by-id-repository";
import { repositoryDeletePitStopById } from "../repository/pit-stops/delete-pit-stops-by-id-repository";
import { repositoryDeletePitStop } from "../repository/pit-stops/delete-pit-stops-repository";
import { repositoryNewPitStop } from "../repository/pit-stops/add-pit-stops-resitory";
import { repositoryEditPitStop } from "../repository/pit-stops/edit-pit-stops-repository";
import { repositoryUpsertPitStop } from "../repository/pit-stops/upsert-pit-stops-repository";


export const pitStopsController = async (server: FastifyInstance) => {

  // GET - List all pit stops and Find pit stops using query string parameters
  server.get("/pit/stops",  async (request, response) =>
      await repositoryListPitStops(request, response)
  );  
      
  // GET - Find pit stops by raceId
  server.get<{Params: PitStopParams}>( "/pit/stop/raceId/:raceId",
    async (request, response) => 
      await repositoryFindPitStopsById(request, response)
  );

  // POST - Create/insert new pit stop
  server.post(
    "/pit/stop",
    async (request, response) =>
      await repositoryNewPitStop(request, response)
  );

  // PUT - (Upsert) Edit or insert new pit stop
  server.put(
    "/pit/stop",
    async (request, response) =>
      await repositoryUpsertPitStop(request, response)
  );

  // PATCH - Edit a pit stop
  server.patch(
    "/pit/stop",
    async (request, response) => 
    await repositoryEditPitStop(request, response)
  );

  // DELETE - Delete a pit
  server.delete(
    "/pit/stop",
    async (request, response) =>
      await repositoryDeletePitStop(request, response)
  );

  // DELETE - Delete a pit by raceId, driver Id and pit
  server.delete<{Params: PitStopParams}>(
    "/pit/stop/raceId/:raceId/driverId/:driverId/lap/:lap",
    async (request, response) =>
      await repositoryDeletePitStopById(request, response)
  );

}