import { FastifyInstance } from "fastify";
import { repositoryListSeasons } from "../repository/seasons/list-seasons-repository";
import { repositoryFindSeasonById } from "../repository/seasons/find-seasons-id-repository";
import { SeasonParams } from "../models/params/season-params-model";
import { repositoryNewSeason } from "../repository/seasons/add-season-repository";
import { repositoryDeleteSeasonById } from "../repository/seasons/delete-season-by-id-repository";
import { repositoryDeleteSeason } from "../repository/seasons/delete-season-repositry";
import { repositoryEditSeason } from "../repository/seasons/edit-season-repository";
import { repositoryUpsertSeason } from "../repository/seasons/upsert-season-repository";



export const seasonsController = async (server: FastifyInstance) => {

  // GET - List all seasons and Find seasons using query string parameters
  server.get("/seasons",  async (request, response) =>
      await repositoryListSeasons(request, response)
  );  
      
  // GET - Find seasons by seasonId
  server.get<{Params: SeasonParams}>( "/season/year/:year",
    async (request, response) => 
      await repositoryFindSeasonById(request, response)
  );

  // POST - Create/insert new season
  server.post(
    "/season",
    async (request, response) =>
      await repositoryNewSeason(request, response)
  );

  // PUT - (Upsert) Edit or insert new season
  server.put(
    "/season",
    async (request, response) =>
      await repositoryUpsertSeason(request, response)
  );

  // PATCH - Edit a season
  server.patch(
    "/season",
    async (request, response) => 
    await repositoryEditSeason(request, response)
  );

  // DELETE - Delete a season
  server.delete(
    "/season",
    async (request, response) =>
      await repositoryDeleteSeason(request, response)
  );

  // DELETE - Delete a season by year
  server.delete<{Params: SeasonParams}>(
    "/season/year/:year",
    async (request, response) =>
      await repositoryDeleteSeasonById(request, response)
  );

}
