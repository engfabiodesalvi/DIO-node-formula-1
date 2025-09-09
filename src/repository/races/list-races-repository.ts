import { FastifyReply, FastifyRequest } from "fastify";
import { listRaces } from "./load-races-repository";

// GET - List all races and Find races using query parameters
export const repositoryListRaces = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the races values
            const { 
                raceId, year, round, circuitId, name, date, time, url, fp1_date, fp1_time,
                fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //    raceId, year, round, circuitId, name, date, time, url, fp1_date, fp1_time,
            //    fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(raceId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(raceId))} - ${raceId}`);

            const races = listRaces.filter((racesItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (raceId) {
                    if (!(racesItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    

                // vetYear = [minYear, maxYear]
                if (year) {
                    const vetYear = year.split(",");
                    if (vetYear.length === 1) {
                        if (!(racesItem.year === parseFloat(vetYear))) {
                                allMatch = false;
                        } 
                    } else if (vetYear.length === 2) {
                        if (!(racesItem.year >= parseFloat(vetYear[0]) &&
                            racesItem.year <= parseFloat(vetYear[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                   

                // vetRound = [minRound, maxRound]
                if (round) {
                    const vetRound = round.split(",");
                    if (vetRound.length === 1) {
                        if (!(racesItem.round === parseFloat(vetRound))) {
                                allMatch = false;
                        } 
                    } else if (vetRound.length === 2) {
                        if (!(racesItem.round >= parseFloat(vetRound[0]) &&
                            racesItem.round <= parseFloat(vetRound[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }     

                if (circuitId) {
                    if (!(racesItem.circuitId === parseInt(circuitId)) ||                
                        !((parseInt(circuitId) > 0)) ||
                        !(Number.isInteger(parseFloat(circuitId)))) {
                        allMatch = false;
                    }
                }                 
      
                
                if (name?.length > 0) {
                    if(!(racesItem.name.toLowerCase()
                        .includes(name.toLowerCase()))) {
                        allMatch = false;
                    }
                }                  
                
                if (date?.length > 0) {
                    if(!(racesItem.date.toLowerCase()
                        .includes(date.toLowerCase()))) {
                        allMatch = false;
                    }
                }                        

                if (time?.length > 0) {
                    if(!(racesItem.time.toLowerCase()
                        .includes(time.toLowerCase()))) {
                        allMatch = false;
                    }
                }          
                
                if (fp1_date?.length > 0) {
                    if(!(racesItem.fp1_date.toLowerCase()
                        .includes(fp1_date.toLowerCase()))) {
                        allMatch = false;
                    }
                }  

                if (fp1_time?.length > 0) {
                    if(!(racesItem.fp1_time.toLowerCase()
                        .includes(fp1_time.toLowerCase()))) {
                        allMatch = false;
                    }
                }                  

                if (fp2_date?.length > 0) {
                    if(!(racesItem.fp2_date.toLowerCase()
                        .includes(fp2_date.toLowerCase()))) {
                        allMatch = false;
                    }
                }   

                if (fp2_time?.length > 0) {
                    if(!(racesItem.fp2_time.toLowerCase()
                        .includes(fp2_time.toLowerCase()))) {
                        allMatch = false;
                    }
                }           

                if (fp3_date?.length > 0) {
                    if(!(racesItem.fp3_date.toLowerCase()
                        .includes(fp3_date.toLowerCase()))) {
                        allMatch = false;
                    }
                }      
                
                if (fp3_time?.length > 0) {
                    if(!(racesItem.fp3_time.toLowerCase()
                        .includes(fp3_time.toLowerCase()))) {
                        allMatch = false;
                    }
                }     
                
                if (quali_date?.length > 0) {
                    if(!(racesItem.quali_date.toLowerCase()
                        .includes(quali_date.toLowerCase()))) {
                        allMatch = false;
                    }
                }      
                
                if (quali_time?.length > 0) {
                    if(!(racesItem.quali_time.toLowerCase()
                        .includes(quali_time.toLowerCase()))) {
                        allMatch = false;
                    }
                }  
                
                if (sprint_date?.length > 0) {
                    if(!(racesItem.sprint_date.toLowerCase()
                        .includes(sprint_date.toLowerCase()))) {
                        allMatch = false;
                    }
                }      
                
                if (sprint_time?.length > 0) {
                    if(!(racesItem.sprint_time.toLowerCase()
                        .includes(sprint_time.toLowerCase()))) {
                        allMatch = false;
                    }
                }                  
                
                return allMatch;
            });

            if (!(races.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Races Not Found" };
            } else {
                response.type("application/json").code(200);
                return { races: races };
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
