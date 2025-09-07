import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorStandingParams } from "../../models/params/constructor-standing-params-model";
import { ConstructorStandingModel } from "../../models/data/constructor-standing-model";
import { listConstructorStandings, loadConstructorStandingsJsonFile, pathConstructorStandingsDataJson, saveExtConstructorStandingsToJsonFile } from "./load-constructor-standings-repository";

// DELETE - Delete a constructor standing
export const repositoryDeleteConstructorStandingById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteConstructorId from params
            const constructorStandingParams = request.params as ConstructorStandingParams;
            const deleteConstructorStandingsId = parseInt(constructorStandingParams.constructorStandingsId) || 0;
            let deleteConstructorStanding:Partial<ConstructorStandingModel> = {constructorStandingsId: deleteConstructorStandingsId};
            
            console.log(deleteConstructorStandingsId);

            // ckeck if deleteConstructorStandingsId is > 0
            if (deleteConstructorStandingsId > 0) {
                // find constructorStandingsId in database
                let foundConstructrorStanding = listConstructorStandings.filter(
                    (itemConstructorStanding)=> {
                        if (itemConstructorStanding.constructorStandingsId === deleteConstructorStandingsId) {
                            deleteConstructorStanding = itemConstructorStanding;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if standing match
                if (foundConstructrorStanding.length > 0) {              
                    
                    const newListConstructorStandings = listConstructorStandings.filter(
                        (itemConstuctorStanding)=> itemConstuctorStanding.constructorStandingsId !== deleteConstructorStanding.constructorStandingsId);
                                                    
                    // save new data to json file
                    await saveExtConstructorStandingsToJsonFile(pathConstructorStandingsDataJson, newListConstructorStandings);
                    await loadConstructorStandingsJsonFile(pathConstructorStandingsDataJson);

                    foundConstructrorStanding = listConstructorStandings.filter(
                        (itemConstructorStanding)=> {
                            if (itemConstructorStanding.constructorStandingsId === deleteConstructorStanding.constructorStandingsId) {
                                console.log('Constructor Standing found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundConstructrorStanding.length === 0) {
                        console.log("Constructor Standing deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[constructorStandingsId: ${deleteConstructorStanding.constructorStandingsId}] deleted!`,
                            "deleteConstructorStanding": deleteConstructorStanding};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[constructorStandingsId: ${deleteConstructorStanding.constructorStandingsId}] wasn't deleted!`,
                            "deleteConstructorStanding": deleteConstructorStanding};                        
                    }
                } else {
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[constructorStandingsId: ${deleteConstructorStanding.constructorStandingsId}] wasn't found!`,
                        "deleteConstructorStanding": deleteConstructorStanding};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[constructorStandingsId: ${deleteConstructorStanding.constructorStandingsId}] must be a positive number!`};                
            }

        //return {"message": "Bearer Token ok!", newCircuit};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
function loadConstructorStandingJsonFile(pathCircuitsDataJson: any) {
    throw new Error("Function not implemented.");
}

