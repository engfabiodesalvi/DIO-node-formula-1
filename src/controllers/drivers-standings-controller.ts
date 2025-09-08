import { FastifyInstance } from "fastify";
import { DriverStandingParams } from "../models/params/driver-standing-params-model";
import { repositoryListDriverStandings } from "../repository/driver-standings/list-driver-standing-repository";
import { repositoryNewDriverStanding } from "../repository/driver-standings/add-driver-standing-repository";
import { repositoryDeleteDriverStandingById } from "../repository/driver-standings/delete-driver-standing-by-id-repository";
import { repositoryDeleteDriverStanding } from "../repository/driver-standings/delete-driver-standing-repository";
import { repositoryEditDriverStanding } from "../repository/driver-standings/edit-driver-standing-repository";
import { repositoryUpsertDriverStanding } from "../repository/driver-standings/upsert-driver-standing-repository";
import { repositoryFindDriverStandingById } from "../repository/driver-standings/find-driver-standing-by-id-repository";


export const driverStandingsController = async (server: FastifyInstance) => {

  // GET - List all driver standings and Find driver standings using query string parameters
  server.get("/driver/standings",  async (request, response) =>
      await repositoryListDriverStandings(request, response)
  );  
      
  // GET - Find driver by id
  server.get<{Params: DriverStandingParams}>( "/driver/standing/id/:driverStandingsId",
    async (request, response) => 
      await repositoryFindDriverStandingById(request, response)
  );

  // POST - Create/insert new driver
  server.post(
    "/driver/standing",
    async (request, response) =>
      await repositoryNewDriverStanding(request, response)
  );

  // PUT - (Upsert) Edit or insert new driver
  server.put(
    "/driver/standing",
    async (request, response) =>
      await repositoryUpsertDriverStanding(request, response)
  );

  // PATCH - Edit a driver
  server.patch(
    "/driver/standing",
    async (request, response) => 
    await repositoryEditDriverStanding(request, response)
  );

  // DELETE - Delete a driver
  server.delete(
    "/driver/standing",
    async (request, response) =>
      await repositoryDeleteDriverStanding(request, response)
  );

  // DELETE - Delete a driver by id
  server.delete<{Params: DriverStandingParams}>(
    "/driver/standing/id/:driverStandingsId",
    async (request, response) =>
      await repositoryDeleteDriverStandingById(request, response)
  );

}