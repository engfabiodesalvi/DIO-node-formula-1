
import { FastifyReply, FastifyRequest } from "fastify";
import { listResults } from "../results/load-results-repository";

// GET - List all results and Find results using query parameters
export const repositoryListResults = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the results values
            const { 
                resultId, raceId, driverId, constructorId, number, grid, position, positionText, positionOrder,
                points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //    resultId, raceId, driverId, constructorId, number, grid, position, positionText,
            //    points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(resultId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(resultId))} - ${resultId}`);

            const results = listResults.filter((resultsItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (resultId) {
                    if (!(resultsItem.resultId === parseInt(resultId)) ||                
                        !((parseInt(resultId) > 0)) ||
                        !(Number.isInteger(parseFloat(resultId)))) {
                        allMatch = false;
                    }
                }    

                if (raceId) {
                    if (!(resultsItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    
                
                if (driverId) {
                    if (!(resultsItem.driverId === parseInt(driverId)) ||                
                        !((parseInt(driverId) > 0)) ||
                        !(Number.isInteger(parseFloat(driverId)))) {
                        allMatch = false;
                    }
                }    
                
                if (constructorId) {
                    if (!(resultsItem.constructorId === parseInt(constructorId)) ||                
                        !((parseInt(constructorId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorId)))) {
                        allMatch = false;
                    }
                }                    

                // vetNumber = [minNumber, maxNumber]
                if (number) {
                    const vetNumber = number.split(",");
                    if (vetNumber.length === 1) {
                        if (!(resultsItem.number === parseFloat(vetNumber))) {
                                allMatch = false;
                        } 
                    } else if (vetNumber.length === 2) {
                        if (!(resultsItem.number >= parseFloat(vetNumber[0]) &&
                            resultsItem.number <= parseFloat(vetNumber[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   

                // vetGrid = [minGrid, maxGrid]
                if (grid) {
                    const vetGrid = grid.split(",");
                    if (vetGrid.length === 1) {
                        if (!(resultsItem.grid === parseFloat(vetGrid))) {
                                allMatch = false;
                        } 
                    } else if (vetGrid.length === 2) {
                        if (!(resultsItem.grid >= parseFloat(vetGrid[0]) &&
                            resultsItem.grid <= parseFloat(vetGrid[1]))) {
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
                        if (!(resultsItem.position === parseFloat(vetPosition))) {
                                allMatch = false;
                        } 
                    } else if (vetPosition.length === 2) {
                        if (!(resultsItem.position >= parseFloat(vetPosition[0]) &&
                            resultsItem.position <= parseFloat(vetPosition[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }            
                      
                if (positionText?.length > 0) {
                    if(!(resultsItem.positionText.toLowerCase()
                        .includes(positionText.toLowerCase()))) {
                        allMatch = false;
                    }
                }                  
                
                // vetPositionOrder = [minPositionOrder, maxPositionOrder]
                if (positionOrder) {
                    const vetPositionOrder = positionOrder.split(",");
                    if (vetPositionOrder.length === 1) {
                        if (!(resultsItem.positionOrder === parseFloat(vetPositionOrder))) {
                                allMatch = false;
                        } 
                    } else if (vetPositionOrder.length === 2) {
                        if (!(resultsItem.positionOrder >= parseFloat(vetPositionOrder[0]) &&
                            resultsItem.positionOrder <= parseFloat(vetPositionOrder[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }  

                // vetPoints = [minPoints, maxPoints]
                if (points) {
                    const vetPoints = points.split(",");
                    if (vetPoints.length === 1) {
                        if (!(resultsItem.points === parseFloat(vetPoints))) {
                                allMatch = false;
                        } 
                    } else if (vetPoints.length === 2) {
                        if (!(resultsItem.points >= parseFloat(vetPoints[0]) &&
                            resultsItem.points <= parseFloat(vetPoints[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }      

                // vetLaps = [minLaps, maxLaps]
                if (laps) {
                    const vetLaps = laps.split(",");
                    if (vetLaps.length === 1) {
                        if (!(resultsItem.laps === parseFloat(vetLaps))) {
                                allMatch = false;
                        } 
                    } else if (vetLaps.length === 2) {
                        if (!(resultsItem.laps >= parseFloat(vetLaps[0]) &&
                            resultsItem.laps <= parseFloat(vetLaps[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                                            

                if (time?.length > 0) {
                    if(!(resultsItem.time.toLowerCase()
                        .includes(time.toLowerCase()))) {
                        allMatch = false;
                    }
                }          

                // vetMilliseconds = [minMilliseconds, maxMilliseconds]
                if (milliseconds) {
                    const vetMilliseconds = milliseconds.split(",");
                    if (vetMilliseconds.length === 1) {
                        if (!(resultsItem.milliseconds === parseFloat(vetMilliseconds))) {
                                allMatch = false;
                        } 
                    } else if (vetMilliseconds.length === 2) {
                        if (!(resultsItem.milliseconds >= parseFloat(vetMilliseconds[0]) &&
                            resultsItem.milliseconds <= parseFloat(vetMilliseconds[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }

                // vetFastestLap = [minFastestLap, maxFastestLap]
                if (fastestLap) {
                    const vetFastestLap = fastestLap.split(",");
                    if (vetFastestLap.length === 1) {
                        if (!(resultsItem.fastestLap === parseFloat(vetFastestLap))) {
                                allMatch = false;
                        } 
                    } else if (vetFastestLap.length === 2) {
                        if (!(resultsItem.fastestLap >= parseFloat(vetFastestLap[0]) &&
                            resultsItem.fastestLap <= parseFloat(vetFastestLap[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }
                
                // vetRank = [minRank, maxRank]
                if (rank) {
                    const vetRank = rank.split(",");
                    if (vetRank.length === 1) {
                        if (!(resultsItem.rank === parseFloat(vetRank))) {
                                allMatch = false;
                        } 
                    } else if (vetRank.length === 2) {
                        if (!(resultsItem.rank >= parseFloat(vetRank[0]) &&
                            resultsItem.rank <= parseFloat(vetRank[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                
                
                if (fastestLapTime?.length > 0) {
                    if(!(resultsItem.fastestLapTime.toLowerCase()
                        .includes(fastestLapTime.toLowerCase()))) {
                        allMatch = false;
                    }
                }  

                if (fastestLapSpeed?.length > 0) {
                    if(!(resultsItem.fastestLapSpeed.toLowerCase()
                        .includes(fastestLapSpeed.toLowerCase()))) {
                        allMatch = false;
                    }
                }                          
                
                if (statusId) {
                    if (!(resultsItem.statusId === parseInt(statusId)) ||                
                        !((parseInt(statusId) > 0)) ||
                        !(Number.isInteger(parseFloat(statusId)))) {
                        allMatch = false;
                    }
                }   

                return allMatch;
            });

            if (!(results.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Results Not Found" };
            } else {
                response.type("application/json").code(200);
                return { results: results };
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