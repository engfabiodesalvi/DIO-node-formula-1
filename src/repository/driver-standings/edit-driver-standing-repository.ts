import { FastifyReply, FastifyRequest } from "fastify";
import { DriverStandingModel } from "../../models/data/driver-standing-model";
import { isPartialDriverStandingModel } from "../../utils/isType/driver-standing-model/is-partial-driverStandingModel-type";
import { listDriverStandings, loadDriverStandingsJsonFile, pathDriverStandingsDataJson, saveExtDriverStandingsToJsonFile, sortListDriverStandings } from "./load-driver-standings-repository";


// PATCH - Edit a driver standing
export const repositoryEditDriverStanding = async (
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
                // check for editDriverStanding key in data body
                let foundKeyeditDriverStanding = false;
                for (const key in reqBody) {
                    if (key === "editDriverStanding")
                        foundKeyeditDriverStanding = true;
                }
                // proceed if the editDriverStanding object was found
                if (foundKeyeditDriverStanding) {
                    // obtain data from editDriverStanding object
                    let editDriverStanding = reqBody['editDriverStanding'] as DriverStandingModel; 
                    console.log(editDriverStanding);
                    // check the data format partially match with DriverStandingModel
                    if (await isPartialDriverStandingModel(editDriverStanding)) { 

                        // find driverStandingId in database
                        if (editDriverStanding.driverStandingsId > 0) {
                            // checking if the driver standing is aready registered
                            let itemMatch = false;
                            listDriverStandings.forEach(itemDriverStanding => {
                                if (itemDriverStanding.driverStandingsId === editDriverStanding.driverStandingsId) {
                                    // edit partially driver standing properties
                                    for (let key in editDriverStanding) {
                                        itemDriverStanding[key as keyof object] = editDriverStanding[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if standings don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Driver Standing Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListDriverStandings();
                            // save insert/edit data to json file
                            await saveExtDriverStandingsToJsonFile(pathDriverStandingsDataJson, listDriverStandings);
                            await loadDriverStandingsJsonFile(pathDriverStandingsDataJson);       
                            
                            // find for inserted/edited driver standing
                            let foundDriverStanding = listDriverStandings.filter(
                                (itemDriverStanding)=> {
                                    if (itemDriverStanding.driverStandingsId === editDriverStanding.driverStandingsId) {
                                        console.log('Driver Standing found!');
                                        // load all data
                                        editDriverStanding = itemDriverStanding;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundDriverStanding.length === 0) {
                                    console.log("DriverStanding wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[driverStandingsId: ${editDriverStanding.driverStandingsId}] wasn't edited!`,
                                        "editDriverStanding": editDriverStanding};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[driverStandingsId: ${editDriverStanding.driverStandingsId}] edited!`,
                                        "editDriverStanding": editDriverStanding};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[driverStandingsId: ${editDriverStanding.driverStandingsId}] must be a positive number!`,
                                "editDriverStanding": editDriverStanding};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send driver standing data to be edited!"}              
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
