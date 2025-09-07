import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorStandingModel } from "../../models/data/constructor-standing-model";
import { isPartialConstructorStandingModel } from "../../utils/isType/constructor-standing-model/is-partial-constructorStandingModel-type";
import { listConstructorStandings, loadConstructorStandingsJsonFile, pathConstructorStandingsDataJson, saveExtConstructorStandingsToJsonFile, sortListConstructorStandings } from "./load-constructor-standings-repository";


// PATCH - Edit a constructor standing
export const repositoryEditConstructorStanding = async (
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
                // check for editConstructorStanding key in data body
                let foundKeyeditConstructorStanding = false;
                for (const key in reqBody) {
                    if (key === "editConstructorStanding")
                        foundKeyeditConstructorStanding = true;
                }
                // proceed if the editConstructorStanding object was found
                if (foundKeyeditConstructorStanding) {
                    // obtain data from editConstructorStanding object
                    let editConstructorStanding = reqBody['editConstructorStanding'] as ConstructorStandingModel; 
                    console.log(editConstructorStanding);
                    // check the data format partially match with ConstructorStandingModel
                    if (await isPartialConstructorStandingModel(editConstructorStanding)) { 

                        // find constructorStandingId in database
                        if (editConstructorStanding.constructorStandingsId > 0) {
                            // checking if the constructor standing is aready registered
                            let itemMatch = false;
                            listConstructorStandings.forEach(itemConstructorStanding => {
                                if (itemConstructorStanding.constructorStandingsId === editConstructorStanding.constructorStandingsId) {
                                    // edit partially constructor standing properties
                                    for (let key in editConstructorStanding) {
                                        itemConstructorStanding[key as keyof object] = editConstructorStanding[key as keyof object];
                                    }
                                    itemMatch = itemMatch || true;
                                } else {
                                    itemMatch = itemMatch || false;
                                }
                            });     
                                                            
                            // item if standings don't match
                            if (!itemMatch) {
                                response.type("application/json").code(404);
                                return { message: "Constructor Standing Not Found" };                                                
                            }

                            // ascendant order circuits 
                            await sortListConstructorStandings();
                            // save insert/edit data to json file
                            await saveExtConstructorStandingsToJsonFile(pathConstructorStandingsDataJson, listConstructorStandings);
                            await loadConstructorStandingsJsonFile(pathConstructorStandingsDataJson);       
                            
                            // find for inserted/edited constructor standing
                            let foundConstructorStanding = listConstructorStandings.filter(
                                (itemConstructorStanding)=> {
                                    if (itemConstructorStanding.constructorStandingsId === editConstructorStanding.constructorStandingsId) {
                                        console.log('Constructor Standing found!');
                                        // load all data
                                        editConstructorStanding = itemConstructorStanding;
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });     
                                
                                // if ok return the item                    
                                if (foundConstructorStanding.length === 0) {
                                    console.log("ConstructorStanding wasn't edited!");
                                    response.type("application/json").code(500); // internal server error  
                                    return {
                                        "message": `[constructorStandingsId: ${editConstructorStanding.constructorStandingsId}] wasn't edited!`,
                                        "editConstructorStanding": editConstructorStanding};
                                } else {
                                    response.type("application/json").code(200); // Ok
                                    return {
                                        "message": `[constructorStandingsId: ${editConstructorStanding.constructorStandingsId}] edited!`,
                                        "upsertConstructorStanding": editConstructorStanding};                        
                                }                            
                        
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorStandingsId: ${editConstructorStanding.constructorStandingsId}] must be a positive number!`,
                                "editConstructorStanding": editConstructorStanding};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }                        
                    
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor standing data to be edited!"}              
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
