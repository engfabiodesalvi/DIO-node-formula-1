import { FastifyInstance } from "fastify";
import { repositoryListCircuits } from "../repository/circuits/list-circuits-repository";
import { CircuitParams } from "../models/params/circuit-params-model";
import { repositoryFindCircuitById } from "../repository/circuits/find-circuit-by-id-repository";
import { repositoryDeleteCircuitById } from "../repository/circuits/delete-circuit-by-id-repository";
import { repositoryDeleteCircuit } from "../repository/circuits/delete-circuit-repository";
import { repositoryNewCircuit } from "../repository/circuits/add-circuit-repository";
import { repositoryUpsertCircuit } from "../repository/circuits/upsert-circuit-repository";
import { repositoryEditCircuit } from "../repository/circuits/edit-circuit-repository";

export const circuitsController = async (server: FastifyInstance) => {

  // GET - List all circuits and Find circuits using query string parameters
  server.get("/circuits",  async (request, response) =>
      await repositoryListCircuits(request, response)
  );  
      
  // GET - Find circuits by id
  server.get<{Params: CircuitParams}>( "/circuits/id/:circuitId",
    async (request, response) => 
      await repositoryFindCircuitById(request, response)
  );

  // POST - Create/insert new circuit
  server.post(
    "/circuit",
    async (request, response) =>
      await repositoryNewCircuit(request, response)
  );

  // PUT - (Upsert) Edit or insert new driver
  server.put(
    "/circuit",
    async (request, response) =>
      await repositoryUpsertCircuit(request, response)
  );

  // PATCH - Edit a driver
  server.patch(
    "/circuit",
    async (request, response) => 
    await repositoryEditCircuit(request, response)
  );

  // DELETE - Delete a circuit
  server.delete(
    "/circuit",
    async (request, response) =>
      await repositoryDeleteCircuit(request, response)
  );

  // DELETE - Delete a circuit by id
  server.delete<{Params: CircuitParams}>(
    "/circuit/id/:circuitId",
    async (request, response) =>
      await repositoryDeleteCircuitById(request, response)
  );

}