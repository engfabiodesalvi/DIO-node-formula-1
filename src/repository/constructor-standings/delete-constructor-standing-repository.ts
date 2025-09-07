import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorStandingModel } from "../../models/data/constructor-standing-model";
import { listConstructorStandings, loadConstructorStandingsJsonFile, pathConstructorStandingsDataJson, saveExtConstructorStandingsToJsonFile } from "./load-constructor-standings-repository";
import { isPartialConstructorStandingModel } from "../../utils/isType/constructor-standing-model/is-partial-constructorStandingModel-type";

// DELETE - Delete a constructor standing
export const repositoryDeleteConstructorStanding = async (
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

                // check for deleteConstructorStanding key in data body
                let foundKeyConstructorStanding = false;
                for (const key in reqBody) {
                    if (key === "deleteConstructorStanding")
                        foundKeyConstructorStanding = true;
                }
                // proceed if the deleteConstructorStanding object was found
                if (foundKeyConstructorStanding) {
                    // obtain data from deleteConstructorStanding object
                    let deleteConstructorStanding = reqBody['deleteConstructorStanding'] as ConstructorStandingModel; 
                    // check the data format match parcially with ConstructorStandingModel
                    if (await isPartialConstructorStandingModel(deleteConstructorStanding)) {
                        
                        // find constructorStandingsId in database
                        if (deleteConstructorStanding.constructorStandingsId >=0) {
                            let foundConstructorStanding = listConstructorStandings.filter(
                                (itemConstructorStanding)=> {
                                    if (itemConstructorStanding.constructorStandingsId === deleteConstructorStanding.constructorStandingsId) {
                                        deleteConstructorStanding = itemConstructorStanding;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });            

                            // delete item if standings match
                            if (foundConstructorStanding.length > 0) {              
                                
                                const newListConstructorStandings = listConstructorStandings.filter(
                                    (itemConstructorStanding)=> itemConstructorStanding.constructorStandingsId !== deleteConstructorStanding.constructorStandingsId);
                                                                
                                // save new data to json file
                                await saveExtConstructorStandingsToJsonFile(pathConstructorStandingsDataJson, newListConstructorStandings);
                                await loadConstructorStandingsJsonFile(pathConstructorStandingsDataJson);

                                // find for deleted constructor standing
                                foundConstructorStanding = listConstructorStandings.filter(
                                    (itemConstructorStanding)=> {
                                        if (itemConstructorStanding.constructorStandingsId === deleteConstructorStanding.constructorStandingsId) {
                                            console.log('Constructor Standing found!');
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    });   

                                // if ok return the item                    
                                if (foundConstructorStanding.length === 0) {
                                    console.log("Constructor Standing deleted");
                                    response.type("application/json").code(200); // Ok                                    
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
                                // constructor standing alredy inserted.
                                response.type("application/json").code(404); // not fund
                                return {
                                    "message": `[constructorStandingsId: ${deleteConstructorStanding.constructorStandingsId}] wasn't found!`,
                                    "deleteConstructorStanding": deleteConstructorStanding};
                            }
                        } else {
                            response.type("application/json").code(400); // bad request
                            return {
                                "message": `[constructorStandingsId: ${deleteConstructorStanding.constructorStandingsId}] must be a positive number!`,
                                "deleteConstructorStanding": deleteConstructorStanding};                
                        }

                    } else {
                        response.type("application/json").code(400); // bad request
                        return {"message": "Incorrect format!"}              
                    }
                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructorStandingsId to be deleted!"}              
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
