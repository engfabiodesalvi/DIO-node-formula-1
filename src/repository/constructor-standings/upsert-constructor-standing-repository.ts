import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorStandingModel } from "../../models/data/constructor-standing-model";
import { isConstructorStandingModel } from "../../utils/isType/constructor-standing-model/is-constructorStandingModel-type";
import { listConstructorStandings, loadConstructorStandingsJsonFile, pathConstructorStandingsDataJson, saveExtConstructorStandingsToJsonFile, sortListConstructorStandings } from "./load-constructor-standings-repository";


// PUT - (Upsert) Edit or inser new constructor standing
export const repositoryUpsertConstructorStanding = async (
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
                // check for upsertConstructorStanding key in data body
                let foundKeyupsertConstructorStanding = false;
                for (const key in reqBody) {
                    if (key === "upsertConstructorStanding")
                        foundKeyupsertConstructorStanding = true;
                }
                // proceed if the upsertConstructorStanding object was found
                if (foundKeyupsertConstructorStanding) {
                    // obtain data from upsertConstructorStanding object
                    let upsertConstructorStanding = reqBody['upsertConstructorStanding'] as ConstructorStandingModel; 
                    // check the data format match with ConstructorStandingModel
                    if (await isConstructorStandingModel(upsertConstructorStanding)) { 

                        // find constructorStandingsId in database
                        if (upsertConstructorStanding.constructorStandingsId > 0) {
                            // checking if the driver is aready registered
                            let itemMatch = false;
                            listConstructorStandings.forEach(itemConstructorStanding => {
                                if (itemConstructorStanding.constructorStandingsId === upsertConstructorStanding.constructorStandingsId) {
                                    // edit constructor standing properties
                                    itemConstructorStanding.raceId = upsertConstructorStanding.raceId;
                                    itemConstructorStanding.constructorId = upsertConstructorStanding.constructorId;
                                    itemConstructorStanding.points = upsertConstructorStanding.points;
                                    itemConstructorStanding.position = upsertConstructorStanding.position;
                                    itemConstructorStanding.positionText = upsertConstructorStanding.positionText;
                                    itemConstructorStanding.wins = upsertConstructorStanding.wins;
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // insert item if standings don't match
                            if (!itemMatch) {
                                listConstructorStandings.push(upsertConstructorStanding);                
                            }

                            // ascendant order constructorStandingsId 
                            await sortListConstructorStandings();
                            // save insert/edit data to json file
                            await saveExtConstructorStandingsToJsonFile(pathConstructorStandingsDataJson, listConstructorStandings);
                            await loadConstructorStandingsJsonFile(pathConstructorStandingsDataJson);       
                            
                            // find for inserted/edited constructor standing
                            let foundConstructorStanding = listConstructorStandings.filter(
                                (itemConstructorStanding)=> {
                                    if (itemConstructorStanding.constructorStandingsId === upsertConstructorStanding.constructorStandingsId) {
                                        upsertConstructorStanding = itemConstructorStanding;
                                        console.log('Constructor Standing found!');
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundConstructorStanding.length === 0) {
                                    console.log("Constructor Standing wasn't inserted!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[constructorStandingsId: ${upsertConstructorStanding.constructorStandingsId}] wasn't inserted!`,
                                        "upsertConstructorStanding": upsertConstructorStanding};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[constructorStandingsId: ${upsertConstructorStanding.constructorStandingsId}] edited/inserted!`,
                                        "upsertConstructorStanding": upsertConstructorStanding};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorStandingsId: ${upsertConstructorStanding.constructorStandingsId}] must be a positive number!`,
                                "upsertConstructorStanding": upsertConstructorStanding};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor standing data to be edited/inserted!"}              
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