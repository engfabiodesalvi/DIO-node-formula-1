import { FastifyReply, FastifyRequest } from "fastify";
import { listLapTimes } from "./load-lap-times-repository";


// GET - List all lap times and Find lap times using query parameters
export const repositoryListLapTimes = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the lap times values
            const { 
                raceId, driverId, lap,
                position, time, milliseconds
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //    raceId, driverId, lap,
            //    position, time, milliseconds
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(lapTimesId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(lapTimesId))} - ${lapTimesId}`);

            const lapTimes = listLapTimes.filter((lapTimesItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (raceId) {
                    if (!(lapTimesItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    

                if (driverId) {
                    if (!(lapTimesItem.driverId === parseInt(driverId)) ||                
                        !((parseInt(driverId) > 0)) ||
                        !(Number.isInteger(parseFloat(driverId)))) {
                        allMatch = false;
                    }
                } 

                // vetLap = [minLap, maxLap]
                if (lap) {
                    const vetLap = lap.split(",");
                    if (vetLap.length === 1) {
                        if (!(lapTimesItem.lap === parseFloat(vetLap))) {
                                allMatch = false;
                        } 
                    } else if (vetLap.length === 2) {
                        if (!(lapTimesItem.lap >= parseFloat(vetLap[0]) &&
                            lapTimesItem.lap <= parseFloat(vetLap[1]))) {
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
                        if (!(lapTimesItem.position === parseFloat(vetPosition))) {
                                allMatch = false;
                        } 
                    } else if (vetPosition.length === 2) {
                        if (!(lapTimesItem.position >= parseFloat(vetPosition[0]) &&
                            lapTimesItem.position <= parseFloat(vetPosition[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   
                
                if (time?.length > 0) {
                    if(!(lapTimesItem.time.toLowerCase()
                        .includes(time.toLowerCase()))) {
                        allMatch = false;
                    }
                }        
                
                // vetMilliseconds = [minMilliseconds, maxMilliseconds]
                if (milliseconds) {
                    const vetMilliseconds = milliseconds.split(",");
                    if (vetMilliseconds.length === 1) {
                        if (!(lapTimesItem.milliseconds === parseFloat(vetMilliseconds))) {
                                allMatch = false;
                        } 
                    } else if (vetMilliseconds.length === 2) {
                        if (!(lapTimesItem.milliseconds >= parseFloat(vetMilliseconds[0]) &&
                            lapTimesItem.milliseconds <= parseFloat(vetMilliseconds[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   

                return allMatch;
            });

            if (!(lapTimes.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Lap Times Not Found" };
            } else {
                response.type("application/json").code(200);
                return { lapTimes };
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