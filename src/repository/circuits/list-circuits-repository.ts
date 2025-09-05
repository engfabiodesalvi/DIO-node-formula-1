import { FastifyReply, FastifyRequest } from "fastify";
import { listCircuits } from "./load-circuits-repository";

// GET - List all circuits and Find circuits using query parameters
export const repositoryListCircuits = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the circuits values
            const { 
                circuitId, circuitRef, name, location, country,
                lat, lng, alt, url 
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //     circuitId, circuitRef, name, location, country,
            //     lat, lng, alt, url 
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(circuitId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(circuitId))} - ${circuitId}`);

            const circuits = listCircuits.filter((circuitItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (circuitId) {
                    if (!(circuitItem.circuitId === parseInt(circuitId)) ||                
                        !((parseInt(circuitId) > 0)) ||
                        !(Number.isInteger(parseFloat(circuitId)))) {
                        allMatch = false;
                    }
                }

                if (circuitRef?.length > 0) {
                    if(!(circuitItem.circuitRef.toLowerCase()
                        .includes(circuitRef.toLowerCase()))) {
                        allMatch = false;
                    }
                }

                if (name?.length > 0) {
                    if(!(circuitItem.name.toLowerCase()
                        .includes(name.toLowerCase()))) {
                        allMatch = false;
                    }
                }

                if (location?.length > 0) {
                    if(!(circuitItem.location.toLowerCase()
                        .includes(location.toLowerCase()))) {
                        allMatch = false;
                    }
                }                

                if (country?.length > 0) {
                    if(!(circuitItem.country.toLowerCase()
                        .includes(country.toLowerCase()))) {
                        allMatch = false;
                    }
                }
                
                //vetLat = [minLat, maxLat]
                if (lat) {
                    const vetLat = lat.split(",");
                    if (typeof(vetLat) === 'object' && vetLat.length === 2) {
                        if (!(circuitItem.lat >= parseFloat(vetLat[0]) &&
                            circuitItem.lat <= parseFloat(vetLat[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        
                    }


                    // if (!(circuitItem.lat === parseFloat(lat)) ||                    
                    // !Number.isFinite(parseFloat(lat))) {
                    //     allMatch = false;
                    // }
                }

                if (lng) {
                    if (!(circuitItem.lng === parseFloat(lng)) ||                    
                    !Number.isFinite(parseFloat(lng))) {
                        allMatch = false;
                    }
                }                
                
                if (alt) {
                    if (!(circuitItem.alt === parseInt(alt)) ||                
                        !(Number.isInteger(parseFloat(alt)))) {
                        allMatch = false;
                    }
                }

                if (url?.length > 0) {
                    if(!(circuitItem.url.toLowerCase()
                        .includes(url.toLowerCase()))) {
                        allMatch = false;
                    }
                }           

                return allMatch;
            });

            if (!(circuits.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Circuit Not Found" };
            } else {
                response.type("application/json").code(200);
                return { circuits };
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