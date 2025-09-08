import { FastifyInstance } from "fastify";
import { ConstructorParams } from "../models/params/constructor-params-model";
import { repositoryListConstructors } from "../repository/constructors/list-constructor-repository";
import { repositoryFindConstructorById } from "../repository/constructors/find-constructor-by-id-repository";
import { repositoryNewConstructor } from "../repository/constructors/add-constructor-resitory";
import { repositoryEditConstructor } from "../repository/constructors/edit-constructor-repository";
import { repositoryDeleteConstructor } from "../repository/constructors/delete-constructor-repository";
import { repositoryUpsertConstructor } from "../repository/constructors/upsert-constructor-repository";
import { repositoryDeleteConstructorById } from "../repository/constructors/delete-constructor-by-id-repository";


export const constructorController = async (server: FastifyInstance) => {

  // GET - List all constructor and Find constructor using query string parameters
  server.get("/constructors",  async (request, response) =>
      await repositoryListConstructors(request, response)
  );  
      
  // GET - Find constructor by id
  server.get<{Params: ConstructorParams}>( "/constructor/id/:constructorId",
    async (request, response) => 
      await repositoryFindConstructorById(request, response)
  );

  // POST - Create/insert new constructor
  server.post(
    "/constructor",
    async (request, response) =>
      await repositoryNewConstructor(request, response)
  );

  // PUT - (Upsert) Edit or insert new constructor
  server.put(
    "/constructor",
    async (request, response) =>
      await repositoryUpsertConstructor(request, response)
  );

  // PATCH - Edit a constructor
  server.patch(
    "/constructor",
    async (request, response) => 
    await repositoryEditConstructor(request, response)
  );

  // DELETE - Delete a constructor
  server.delete(
    "/constructor",
    async (request, response) =>
      await repositoryDeleteConstructor(request, response)
  );

  // DELETE - Delete a constructor by id
  server.delete<{Params: ConstructorParams}>(
    "/constructor/id/:constructorId",
    async (request, response) =>
      await repositoryDeleteConstructorById(request, response)
  );

}