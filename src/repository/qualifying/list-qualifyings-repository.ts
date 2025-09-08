import { FastifyReply, FastifyRequest } from "fastify";
import { listQualifyings } from "./load-qualifyings-repository";

// GET - List all qualifyings and Find qualifyings using query parameters
export const repositoryListQualifyings = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the qualifyings values
            const { 
                qualifyId, raceId, driverId, constructorId, 
                number, position, q1, q2, q3
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //    qualifyId, raceId, driverId, constructorId, 
            //    number, position, q1, q2, q3
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(raceId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(qualifyId))} - ${qualifyId}`);

            const qualifyings = listQualifyings.filter((qualifyingsItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (qualifyId) {
                    if (!(qualifyingsItem.qualifyId === parseInt(qualifyId)) ||                
                        !((parseInt(qualifyId) > 0)) ||
                        !(Number.isInteger(parseFloat(qualifyId)))) {
                        allMatch = false;
                    }
                }    

                if (raceId) {
                    if (!(qualifyingsItem.raceId === parseInt(raceId)) ||                
                        !((parseInt(raceId) > 0)) ||
                        !(Number.isInteger(parseFloat(raceId)))) {
                        allMatch = false;
                    }
                }    

                if (driverId) {
                    if (!(qualifyingsItem.driverId === parseInt(driverId)) ||                
                        !((parseInt(driverId) > 0)) ||
                        !(Number.isInteger(parseFloat(driverId)))) {
                        allMatch = false;
                    }
                } 

                if (constructorId) {
                    if (!(qualifyingsItem.constructorId === parseInt(constructorId)) ||                
                        !((parseInt(constructorId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorId)))) {
                        allMatch = false;
                    }
                }                 

                // vetNumber = [minNumber, maxNumber]
                if (number) {
                    const vetNumber = number.split(",");
                    if (vetNumber.length === 1) {
                        if (!(qualifyingsItem.number === parseFloat(vetNumber))) {
                                allMatch = false;
                        } 
                    } else if (vetNumber.length === 2) {
                        if (!(qualifyingsItem.number >= parseFloat(vetNumber[0]) &&
                            qualifyingsItem.number <= parseFloat(vetNumber[1]))) {
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
                        if (!(qualifyingsItem.position === parseFloat(vetPosition))) {
                                allMatch = false;
                        } 
                    } else if (vetPosition.length === 2) {
                        if (!(qualifyingsItem.position >= parseFloat(vetPosition[0]) &&
                            qualifyingsItem.position <= parseFloat(vetPosition[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }           
                
                if (q1?.length > 0) {
                    if(!(qualifyingsItem.q1.toLowerCase()
                        .includes(q1.toLowerCase()))) {
                        allMatch = false;
                    }
                }                  
                
                if (q2?.length > 0) {
                    if(!(qualifyingsItem.q2.toLowerCase()
                        .includes(q2.toLowerCase()))) {
                        allMatch = false;
                    }
                }                        

                if (q3?.length > 0) {
                    if(!(qualifyingsItem.q3.toLowerCase()
                        .includes(q3.toLowerCase()))) {
                        allMatch = false;
                    }
                }                
                return allMatch;
            });

            if (!(qualifyings.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Qualifyings Not Found" };
            } else {
                response.type("application/json").code(200);
                return { qualifyings: qualifyings };
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