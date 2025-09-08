import { FastifyReply, FastifyRequest } from "fastify";
import { listPitStops } from "./load-pit-stops-repository";

// GET - List all pit stops and Find pit stops using query parameters
export const repositoryListPitStops = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the pit stops values
            const { 
                raceId, driverId, stop, lap,
                time, duration, milliseconds
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //    raceId, driverId, stop, lap
            //    time, duration, milliseconds
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(raceId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(raceId))} - ${raceId}`);

            const pitStops = listPitStops.filter((pitStopsItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (raceId) {
                    if (!(pitStopsItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    

                if (driverId) {
                    if (!(pitStopsItem.driverId === parseInt(driverId)) ||                
                        !((parseInt(driverId) > 0)) ||
                        !(Number.isInteger(parseFloat(driverId)))) {
                        allMatch = false;
                    }
                } 

                // vetStop = [minStop, maxStop]
                if (stop) {
                    const vetStop = stop.split(",");
                    if (vetStop.length === 1) {
                        if (!(pitStopsItem.stop === parseFloat(vetStop))) {
                                allMatch = false;
                        } 
                    } else if (vetStop.length === 2) {
                        if (!(pitStopsItem.stop >= parseFloat(vetStop[0]) &&
                            pitStopsItem.stop <= parseFloat(vetStop[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   

                // vetLap = [minLap, maxLap]
                if (lap) {
                    const vetLap = lap.split(",");
                    if (vetLap.length === 1) {
                        if (!(pitStopsItem.lap === parseFloat(vetLap))) {
                                allMatch = false;
                        } 
                    } else if (vetLap.length === 2) {
                        if (!(pitStopsItem.lap >= parseFloat(vetLap[0]) &&
                            pitStopsItem.lap <= parseFloat(vetLap[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }           
                
                if (time?.length > 0) {
                    if(!(pitStopsItem.time.toLowerCase()
                        .includes(time.toLowerCase()))) {
                        allMatch = false;
                    }
                }                  
                
                if (duration?.length > 0) {
                    if(!(pitStopsItem.duration.toLowerCase()
                        .includes(duration.toLowerCase()))) {
                        allMatch = false;
                    }
                }        
                
                // vetMilliseconds = [minMilliseconds, maxMilliseconds]
                if (milliseconds) {
                    const vetMilliseconds = milliseconds.split(",");
                    if (vetMilliseconds.length === 1) {
                        if (!(pitStopsItem.milliseconds === parseFloat(vetMilliseconds))) {
                                allMatch = false;
                        } 
                    } else if (vetMilliseconds.length === 2) {
                        if (!(pitStopsItem.milliseconds >= parseFloat(vetMilliseconds[0]) &&
                            pitStopsItem.milliseconds <= parseFloat(vetMilliseconds[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   

                return allMatch;
            });

            if (!(pitStops.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Pit Stops Not Found" };
            } else {
                response.type("application/json").code(200);
                return { pitStops };
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