import { FastifyInstance } from "fastify";
import { repositoryListDrivers } from "../repository/drivers/list-drivers-repository";
import { DriverParams } from "../models/params/driver-params-model";
import { repositoryNewDriver } from "../repository/drivers/add-driver-repository";
import { repositoryDeleteDriver } from "../repository/drivers/delete-driver-repositry";
import { repositoryEditDriver } from "../repository/drivers/edit-driver-repository";
import { repositoryFindDriverById } from "../repository/drivers/find-driver-id-repository";
import { repositoryUpsertDriver } from "../repository/drivers/upsert-driver-repository";
import { repositoryDeleteDriverById } from "../repository/drivers/delete-driver-by-id-repository";

export const driversController = async (server: FastifyInstance) => {

  // GET - List all drivers and Find drivers using query string parameters
  server.get("/drivers",  async (request, response) =>
      await repositoryListDrivers(request, response)
  );  
      
  // GET - Find driver by id
  server.get<{Params: DriverParams}>( "/driver/id/:driverId",
    async (request, response) => 
      await repositoryFindDriverById(request, response)
  );

  // POST - Create/insert new driver
  server.post(
    "/driver",
    async (request, response) =>
      await repositoryNewDriver(request, response)
  );

  // PUT - (Upsert) Edit or insert new driver
  server.put(
    "/driver",
    async (request, response) =>
      await repositoryUpsertDriver(request, response)
  );

  // PATCH - Edit a driver
  server.patch(
    "/driver",
    async (request, response) => 
    await repositoryEditDriver(request, response)
  );

  // DELETE - Delete a driver
  server.delete(
    "/driver",
    async (request, response) =>
      await repositoryDeleteDriver(request, response)
  );

  // DELETE - Delete a driver by id
  server.delete<{Params: DriverParams}>(
    "/driver/id/:driverId",
    async (request, response) =>
      await repositoryDeleteDriverById(request, response)
  );

}