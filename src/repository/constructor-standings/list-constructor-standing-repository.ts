import { FastifyReply, FastifyRequest } from "fastify";
import { listConstructorStandings } from "./load-constructor-standings-repository";


// GET - List all constructor standings and Find constructor standings using query parameters
export const repositoryListConstructorStandings = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the constructor standings values
            const { 
                constructorStandingsId, raceId, constructorId,
                points, position, positionText, wins
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
                // constructorStandingsId, raceId, constructorId,
                // points, position, positionText, wins
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(constructorStandingsId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(constructorStandingsId))} - ${constructorStandingsId}`);

            const constructorStandings = listConstructorStandings.filter((constructorStandingsItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (constructorStandingsId) {
                    if (!(constructorStandingsItem.constructorStandingsId === parseInt(constructorStandingsId)) ||                
                        !((parseInt(constructorStandingsId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorStandingsId)))) {
                        allMatch = false;
                    }
                }

                if (raceId) {
                    if (!(constructorStandingsItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    

                if (constructorId) {
                    if (!(constructorStandingsItem.constructorId === parseInt(constructorId)) ||                
                        !((parseInt(constructorId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorId)))) {
                        allMatch = false;
                    }
                } 

                // vetPoints = [minPoint, maxPoint]
                if (points) {
                    const vetPoints = points.split(",");
                    if (vetPoints.length === 1) {
                        if (!(constructorStandingsItem.points === parseFloat(vetPoints))) {
                                allMatch = false;
                        } 
                    } else if (vetPoints.length === 2) {
                        if (!(constructorStandingsItem.points >= parseFloat(vetPoints[0]) &&
                            constructorStandingsItem.points <= parseFloat(vetPoints[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }   

                // vetPosition = [minPosition, maxPosition]
                if (position) {
                    const vetPosition = position.split(",");
                    if (vetPosition.length === 1) {
                        if (!(constructorStandingsItem.position === parseFloat(vetPosition))) {
                                allMatch = false;
                        } 
                    } else if (vetPosition.length === 2) {
                        if (!(constructorStandingsItem.position >= parseFloat(vetPosition[0]) &&
                            constructorStandingsItem.position <= parseFloat(vetPosition[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   
                
                if (positionText?.length > 0) {
                    if(!(constructorStandingsItem.positionText.toLowerCase()
                        .includes(positionText.toLowerCase()))) {
                        allMatch = false;
                    }
                }        
                
                // vetWins = [minWin, maxWin]
                if (wins) {
                    const vetWins = wins.split(",");
                    if (vetWins.length === 1) {
                        if (!(constructorStandingsItem.wins === parseFloat(vetWins))) {
                                allMatch = false;
                        } 
                    } else if (vetWins.length === 2) {
                        if (!(constructorStandingsItem.wins >= parseFloat(vetWins[0]) &&
                            constructorStandingsItem.wins <= parseFloat(vetWins[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   

                return allMatch;
            });

            if (!(constructorStandings.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Constructor Standings Not Found" };
            } else {
                response.type("application/json").code(200);
                return { constructorStandings };
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