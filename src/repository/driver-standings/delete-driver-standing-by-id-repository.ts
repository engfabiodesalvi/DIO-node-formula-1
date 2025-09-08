import { FastifyReply, FastifyRequest } from "fastify";
import { DriverStandingParams } from "../../models/params/driver-standing-params-model";
import { DriverStandingModel } from "../../models/data/driver-standing-model";
import { listDriverStandings, loadDriverStandingsJsonFile, pathDriverStandingsDataJson, saveExtDriverStandingsToJsonFile } from "./load-driver-standings-repository";

// DELETE - Delete a driver standing
export const repositoryDeleteDriverStandingById = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // Obtain deleteDriverId from params
            const driverStandingParams = request.params as DriverStandingParams;
            const deleteDriverStandingsId = parseInt(driverStandingParams.driverStandingsId) || 0;
            let deleteDriverStanding:Partial<DriverStandingModel> = {driverStandingsId: deleteDriverStandingsId};
            
            console.log(deleteDriverStandingsId);

            // ckeck if deleteDriverStandingsId is > 0
            if (deleteDriverStandingsId > 0) {
                // find driverStandingsId in database
                let foundConstructrorStanding = listDriverStandings.filter(
                    (itemDriverStanding)=> {
                        if (itemDriverStanding.driverStandingsId === deleteDriverStandingsId) {
                            deleteDriverStanding = itemDriverStanding;
                            return true;
                        } else {
                            return false;
                        }
                    });            

                // delete item if standing match
                if (foundConstructrorStanding.length > 0) {              
                    
                    const newListDriverStandings = listDriverStandings.filter(
                        (itemConstuctorStanding)=> itemConstuctorStanding.driverStandingsId !== deleteDriverStanding.driverStandingsId);
                                                    
                    // save new data to json file
                    await saveExtDriverStandingsToJsonFile(pathDriverStandingsDataJson, newListDriverStandings);
                    await loadDriverStandingsJsonFile(pathDriverStandingsDataJson);

                    foundConstructrorStanding = listDriverStandings.filter(
                        (itemDriverStanding)=> {
                            if (itemDriverStanding.driverStandingsId === deleteDriverStanding.driverStandingsId) {
                                console.log('Driver Standing found!');
                                return true;
                            }else{
                                return false;
                            }
                        });   

                    // if ok return the item                    
                    if (foundConstructrorStanding.length === 0) {
                        console.log("Driver Standing deleted");
                        response.type("application/json").code(200); // not content                                    
                        return {
                            "message": `[driverStandingsId: ${deleteDriverStanding.driverStandingsId}] deleted!`,
                            "deleteDriverStanding": deleteDriverStanding};
                    } else {
                        response.type("application/json").code(500); // internal server error
                        return {
                            "message": `[driverStandingsId: ${deleteDriverStanding.driverStandingsId}] wasn't deleted!`,
                            "deleteDriverStanding": deleteDriverStanding};                        
                    }
                } else {
                    // circuit alredy inserted.
                    response.type("application/json").code(404); // not fund
                    return {
                        "message": `[driverStandingsId: ${deleteDriverStanding.driverStandingsId}] wasn't found!`,
                        "deleteDriverStanding": deleteDriverStanding};
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {
                    "message": `[driverStandingsId: ${deleteDriverStanding.driverStandingsId}] must be a positive number!`};                
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
function loadDriverStandingJsonFile(pathCircuitsDataJson: any) {
    throw new Error("Function not implemented.");
}

