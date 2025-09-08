import { FastifyReply, FastifyRequest } from "fastify";
import { DriverStandingModel } from "../../models/data/driver-standing-model";
import { isDriverStandingModel } from "../../utils/isType/driver-standing-model/is-driverStandingModel-type";
import { listDriverStandings, loadDriverStandingsJsonFile, pathDriverStandingsDataJson, saveExtDriverStandingsToJsonFile, sortListDriverStandings } from "./load-driver-standings-repository";


// PUT - (Upsert) Edit or inser new driver standing
export const repositoryUpsertDriverStanding = async (
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
                // check for upsertDriverStanding key in data body
                let foundKeyupsertDriverStanding = false;
                for (const key in reqBody) {
                    if (key === "upsertDriverStanding")
                        foundKeyupsertDriverStanding = true;
                }
                // proceed if the upsertDriverStanding object was found
                if (foundKeyupsertDriverStanding) {
                    // obtain data from upsertDriverStanding object
                    let upsertDriverStanding = reqBody['upsertDriverStanding'] as DriverStandingModel; 
                    // check the data format match with DriverStandingModel
                    if (await isDriverStandingModel(upsertDriverStanding)) { 

                        // find driverStandingsId in database
                        if (upsertDriverStanding.driverStandingsId > 0) {
                            // checking if the driver is aready registered
                            let itemMatch = false;
                            listDriverStandings.forEach(itemDriverStanding => {
                                if (itemDriverStanding.driverStandingsId === upsertDriverStanding.driverStandingsId) {
                                    // edit driver standing properties
                                    itemDriverStanding.raceId = upsertDriverStanding.raceId;
                                    itemDriverStanding.driverId = upsertDriverStanding.driverId;
                                    itemDriverStanding.points = upsertDriverStanding.points;
                                    itemDriverStanding.position = upsertDriverStanding.position;
                                    itemDriverStanding.positionText = upsertDriverStanding.positionText;
                                    itemDriverStanding.wins = upsertDriverStanding.wins;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if standings don't match
                            if (!itemMatch) {
                                listDriverStandings.push(upsertDriverStanding);                
                            }

                            // ascendant order driverStandingsId 
                            await sortListDriverStandings();
                            // save insert/edit data to json file
                            await saveExtDriverStandingsToJsonFile(pathDriverStandingsDataJson, listDriverStandings);
                            await loadDriverStandingsJsonFile(pathDriverStandingsDataJson);       
                            
                            // find for inserted/edited driver standing
                            let foundDriverStanding = listDriverStandings.filter(
                                (itemDriverStanding)=> {
                                    if (itemDriverStanding.driverStandingsId === upsertDriverStanding.driverStandingsId) {
                                        upsertDriverStanding = itemDriverStanding;
                                        console.log('Driver Standing found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundDriverStanding.length === 0) {
                                    console.log("Driver Standing wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[driverStandingsId: ${upsertDriverStanding.driverStandingsId}] wasn't inserted!`,
                                        "upsertDriverStanding": upsertDriverStanding};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[driverStandingsId: ${upsertDriverStanding.driverStandingsId}] edited/inserted!`,
                                        "upsertDriverStanding": upsertDriverStanding};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[driverStandingsId: ${upsertDriverStanding.driverStandingsId}] must be a positive number!`,
                                "upsertDriverStanding": upsertDriverStanding};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver standing data to be edited/inserted!"}              
                }

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                

        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }                
}