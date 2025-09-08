import { FastifyReply, FastifyRequest } from "fastify";
import { DriverStandingModel } from "../../models/data/driver-standing-model";
import { isDriverStandingModel } from "../../utils/isType/driver-standing-model/is-driverStandingModel-type";
import { listDriverStandings, loadDriverStandingsJsonFile, pathDriverStandingsDataJson, saveExtDriverStandingsToJsonFile, sortListDriverStandings } from "./load-driver-standings-repository";



// POST - Create/insert new driver standing
export const repositoryNewDriverStanding = async (
    request: FastifyRequest,
    response: FastifyReply
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // ckeck if reqBody is defined
            if (reqBody) {            
                // check for newDriverStanding key in data body
                let foundKeyNewDriverStanding = false;
                for (const key in reqBody) {
                    if (key === "newDriverStanding")
                        foundKeyNewDriverStanding = true;            
                }
                // proceed if the newDriverStanding object was found
                if (foundKeyNewDriverStanding) {
                    // obtain data from newDriverStanding object
                    let newDriverStanding = reqBody['newDriverStanding'] as DriverStandingModel; 
                    // check the data format match with DriverStandingModel
                    if (await isDriverStandingModel(newDriverStanding)) { 

                        // checking if driverStandingsId > 0
                        if (newDriverStanding.driverStandingsId > 0) {

                            // find new driver standing id in database
                            let findDriverStanding = listDriverStandings.filter(
                                (itemDriverStanding)=> itemDriverStanding.driverStandingsId === newDriverStanding.driverStandingsId);

                            // insert new item if no standings match
                            if (findDriverStanding.length === 0) {              
                                listDriverStandings.push(newDriverStanding);

                                // ascendant order driver standings 
                                await sortListDriverStandings();
                                // save new data to json file
                                await saveExtDriverStandingsToJsonFile(pathDriverStandingsDataJson, listDriverStandings);
                                await loadDriverStandingsJsonFile(pathDriverStandingsDataJson);      
                                            
                                //listDriverStandings = listDriverStandings.sort((a, b) => a.driverStandingsId - b.driverStandingsId);
                                // verify if new item was inserted
                                findDriverStanding = listDriverStandings.filter(
                                    (itemDriverStanding)=> {
                                        if (itemDriverStanding.driverStandingsId === newDriverStanding.driverStandingsId) {
                                            newDriverStanding = itemDriverStanding;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findDriverStanding.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[driverStandingsId: ${newDriverStanding.driverStandingsId}] inserted!`, 
                                        "newDriverStanding": findDriverStanding};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[driverStandingsId: ${newDriverStanding.driverStandingsId}] wasn't inserted!`,
                                        "newDriverStanding": newDriverStanding};
                                }
                            } else {
                                // driver standing alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[driverStandingsId: ${newDriverStanding.driverStandingsId}] already created!`,
                                    "newDriverStanding": newDriverStanding};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[driverStandingsId: ${newDriverStanding.driverStandingsId}] must be a positive number!`,
                                "newDriverStanding": newDriverStanding};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver standing data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newDriverStanding};
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }


    //return request.headers.authorization;
}
