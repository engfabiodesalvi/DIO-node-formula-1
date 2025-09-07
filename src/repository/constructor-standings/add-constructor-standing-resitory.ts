import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorStandingModel } from "../../models/data/constructor-standing-model";
import { isConstructorStandingModel } from "../../utils/isType/constructor-standing-model/is-constructorStandingModel-type";
import { listConstructorStandings, loadConstructorStandingsJsonFile, pathConstructorStandingsDataJson, saveExtConstructorStandingsToJsonFile, sortListConstructorStandings } from "../constructor-standings/load-constructor-standings-repository";


// POST - Create/insert new constructor standing
export const repositoryNewConstructorStanding = async (
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
                // check for newConstructorStanding key in data body
                let foundKeyNewConstructorStanding = false;
                for (const key in reqBody) {
                    if (key === "newConstructorStanding")
                        foundKeyNewConstructorStanding = true;            
                }
                // proceed if the newConstructorStanding object was found
                if (foundKeyNewConstructorStanding) {
                    // obtain data from newConstructorStanding object
                    let newConstructorStanding = reqBody['newConstructorStanding'] as ConstructorStandingModel; 
                    // check the data format match with ConstructorStandingModel
                    if (await isConstructorStandingModel(newConstructorStanding)) { 

                        // checking if constructorStandingsId > 0
                        if (newConstructorStanding.constructorStandingsId > 0) {

                            // find new constructor standing id in database
                            let findConstructorStanding = listConstructorStandings.filter(
                                (itemConstructorStanding)=> itemConstructorStanding.constructorStandingsId === newConstructorStanding.constructorStandingsId);

                            // insert new item if no standings match
                            if (findConstructorStanding.length === 0) {              
                                listConstructorStandings.push(newConstructorStanding);

                                // ascendant order constructor standings 
                                await sortListConstructorStandings();
                                // save new data to json file
                                await saveExtConstructorStandingsToJsonFile(pathConstructorStandingsDataJson, listConstructorStandings);
                                await loadConstructorStandingsJsonFile(pathConstructorStandingsDataJson);      
                                            
                                //listConstructorStandings = listConstructorStandings.sort((a, b) => a.constructorStandingsId - b.constructorStandingsId);
                                // verify if new item was inserted
                                findConstructorStanding = listConstructorStandings.filter(
                                    (itemConstructorStanding)=> {
                                        if (itemConstructorStanding.constructorStandingsId === newConstructorStanding.constructorStandingsId) {
                                            newConstructorStanding = itemConstructorStanding;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                            
                                // if ok return the item                    
                                if (findConstructorStanding.length === 1) {
                                    response.type("application/json").code(201); // created
                                    return {
                                        "message": `[constructorStandingsId: ${newConstructorStanding.constructorStandingsId}] inserted!`, 
                                        "newConstructorStanding": findConstructorStanding};
                                } else {
                                    response.type("application/json").code(500); // internal server error
                                    return {
                                        "message": `[constructorStandingsId: ${newConstructorStanding.constructorStandingsId}] wasn't inserted!`,
                                        "newConstructorStanding": newConstructorStanding};
                                }
                            } else {
                                // constructor standing alredy inserted.
                                response.type("application/json").code(409); // Conflict
                                return {
                                    "message": `[constructorStandingsId: ${newConstructorStanding.constructorStandingsId}] already created!`,
                                    "newConstructorStanding": newConstructorStanding};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorStandingsId: ${newConstructorStanding.constructorStandingsId}] must be a positive number!`,
                                "newConstructorStanding": newConstructorStanding};                        
                        }                            
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }      

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructor standing data to be inserted!"}
                }                    

            } else {
                response.type("application/json").code(400); // bad request
                return {"message": "Empty body!"}              
            }                                
            //return {"message": "Bearer Token ok!", newConstructorStanding};
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
