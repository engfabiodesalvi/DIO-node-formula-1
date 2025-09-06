import { FastifyReply, FastifyRequest } from "fastify";
import { listConstructorResults } from "./load-constructor-results-repository";

// GET - List all constructor results and Find constructor results using query parameters
export const repositoryListConstructorResults = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the constructor results values
            const { 
                constructorResultsId, raceId, constructorId,
                points, status
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //     constructorResultsId, raceId, constructorId,
            //     points, status
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(constructorResultsId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(constructorResultsId))} - ${constructorResultsId}`);

            const constructorResults = listConstructorResults.filter((constructorResultsItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (constructorResultsId) {
                    if (!(constructorResultsItem.constructorResultsId === parseInt(constructorResultsId)) ||                
                        !((parseInt(constructorResultsId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorResultsId)))) {
                        allMatch = false;
                    }
                }

                if (raceId) {
                    if (!(constructorResultsItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    

                if (constructorId) {
                    if (!(constructorResultsItem.constructorId === parseInt(constructorId)) ||                
                        !((parseInt(constructorId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorId)))) {
                        allMatch = false;
                    }
                } 

                // vetPoints = [minPoint, maxPoint]
                if (points) {
                    const vetPoints = points.split(",");
                    if (vetPoints.length === 1) {
                        if (!(constructorResultsItem.points === parseFloat(vetPoints))) {
                                allMatch = false;
                        } 
                    } else if (vetPoints.length === 2) {
                        if (!(constructorResultsItem.points >= parseFloat(vetPoints[0]) &&
                            constructorResultsItem.points <= parseFloat(vetPoints[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }

                }   
                
                if (status?.length > 0) {
                    if(!(constructorResultsItem.status.toLowerCase()
                        .includes(status.toLowerCase()))) {
                        allMatch = false;
                    }
                }                   

                return allMatch;
            });

            if (!(constructorResults.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Constructor Results Not Found" };
            } else {
                response.type("application/json").code(200);
                return { constructorResults };
            }   
        } else {
            response.type("application/json").code(401); // unauthorized
            return {"message": "Bearer Token wrong!"};
        }
    } else {
        response.type("application/json").code(401); // unauthorized
        return {"message": "Missing Bearer Token."};
    }     
};