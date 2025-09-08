import { FastifyReply, FastifyRequest } from "fastify";
import { DriverStandingModel } from "../../models/data/driver-standing-model";
import { isPartialDriverStandingModel } from "../../utils/isType/driver-standing-model/is-partial-driverStandingModel-type";
import { listDriverStandings, loadDriverStandingsJsonFile, pathDriverStandingsDataJson, saveExtDriverStandingsToJsonFile } from "./load-driver-standings-repository";

// DELETE - Delete a driver standing
export const repositoryDeleteDriverStanding = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // ckeck if reqBody is defined
            if (reqBody) {

                // check for deleteDriverStanding key in data body
                let foundKeyDriverStanding = false;
                for (const key in reqBody) {
                    if (key === "deleteDriverStanding")
                        foundKeyDriverStanding = true;
                }
                // proceed if the deleteDriverStanding object was found
                if (foundKeyDriverStanding) {
                    // obtain data from deleteDriverStanding object
                    let deleteDriverStanding = reqBody['deleteDriverStanding'] as DriverStandingModel; 
                    // check the data format match parcially with DriverStandingModel
                    if (await isPartialDriverStandingModel(deleteDriverStanding)) {
                        
                        // find driverStandingsId in database
                        if (deleteDriverStanding.driverStandingsId >=0) {
                            let foundDriverStanding = listDriverStandings.filter(
                                (itemDriverStanding)=> {
                                    if (itemDriverStanding.driverStandingsId === deleteDriverStanding.driverStandingsId) {
                                        deleteDriverStanding = itemDriverStanding;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if standings match
                            if (foundDriverStanding.length > 0) {              
                                
                                const newListDriverStandings = listDriverStandings.filter(
                                    (itemDriverStanding)=> itemDriverStanding.driverStandingsId !== deleteDriverStanding.driverStandingsId);
                                                                
                                // save new data to json file
                                await saveExtDriverStandingsToJsonFile(pathDriverStandingsDataJson, newListDriverStandings);
                                await loadDriverStandingsJsonFile(pathDriverStandingsDataJson);

                                // find for deleted driver standing
                                foundDriverStanding = listDriverStandings.filter(
                                    (itemDriverStanding)=> {
                                        if (itemDriverStanding.driverStandingsId === deleteDriverStanding.driverStandingsId) {
                                            console.log('Driver Standing found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundDriverStanding.length === 0) {
                                    console.log("Driver Standing deleted");
                                    response.type("application/json").code(200); // Ok                                    
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
                                // driver standing alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[driverStandingsId: ${deleteDriverStanding.driverStandingsId}] wasn't found!`,
                                    "deleteDriverStanding": deleteDriverStanding};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[driverStandingsId: ${deleteDriverStanding.driverStandingsId}] must be a positive number!`,
                                "deleteDriverStanding": deleteDriverStanding};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driverStandingsId to be deleted!"}              
                }
            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }
        //return {"message": "Bearer Token ok!", newDriver};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }    
}
