import { FastifyInstance } from "fastify";
import { LapTimeParams } from "../models/params/lap-time-params-model";
import { repositoryListLapTimes } from "../repository/lap-times/list-lap-times-repository";
import { repositoryFindLapTimesById } from "../repository/lap-times/find-lap-times-by-id-repository";
import { repositoryDeleteLapTime } from "../repository/lap-times/delete-lap-time-repository";
import { repositoryDeleteLapTimeById } from "../repository/lap-times/delete-lap-times-by-id-repository";
import { repositoryUpsertLapTime } from "../repository/lap-times/upsert-lap-time-repository";
import { repositoryNewLapTime } from "../repository/lap-times/add-lap-time-resitory";
import { repositoryEditLapTime } from "../repository/lap-times/edit-lap-time-repository";


export const lapTimesController = async (server: FastifyInstance) => {

  // GET - List all lap times and Find lap times using query string parameters
  server.get("/lap/times",  async (request, response) =>
      await repositoryListLapTimes(request, response)
  );  
      
  // GET - Find lap times by raceId
  server.get<{Params: LapTimeParams}>( "/lap/time/raceId/:raceId",
    async (request, response) => 
      await repositoryFindLapTimesById(request, response)
  );

  // POST - Create/insert new lap time
  server.post(
    "/lap/time",
    async (request, response) =>
      await repositoryNewLapTime(request, response)
  );

  // PUT - (Upsert) Edit or insert new lap time
  server.put(
    "/lap/time",
    async (request, response) =>
      await repositoryUpsertLapTime(request, response)
  );

  // PATCH - Edit a lap time
  server.patch(
    "/lap/time",
    async (request, response) => 
    await repositoryEditLapTime(request, response)
  );

  // DELETE - Delete a lap
  server.delete(
    "/lap/time",
    async (request, response) =>
      await repositoryDeleteLapTime(request, response)
  );

  // DELETE - Delete a lap by raceId, driver Id and lap
  server.delete<{Params: LapTimeParams}>(
    "/lap/time/raceId/:raceId/driverId/:driverId/lap/:lap",
    async (request, response) =>
      await repositoryDeleteLapTimeById(request, response)
  );

}