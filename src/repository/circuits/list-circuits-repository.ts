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
                
                // vetLat = [minLat, maxLat]
                if (lat) {
                    const vetLat = lat.split(",");
                    if (vetLat.length === 1) {
                        if (!(circuitItem.lat === parseFloat(vetLat))) {
                                allMatch = false;
                        } 
                    } else if (vetLat.length === 2) {
                        if (!(circuitItem.lat >= parseFloat(vetLat[0]) &&
                            circuitItem.lat <= parseFloat(vetLat[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }

                // vetlng = [minLng, maxLng]
                if (lng) {
                    const vetLng = lng.split(",");
                    if (vetLng.length === 1) {
                        if (!(circuitItem.lng === parseFloat(vetLng))) {
                                allMatch = false;
                        } 
                    } else if (vetLng.length === 2) {
                        if (!(circuitItem.lng >= parseFloat(vetLng[0]) &&
                            circuitItem.lng <= parseFloat(vetLng[1]))) {
                                allMatch = false;
                        }                        
                    } else {
                        allMatch = false;
                    }
                }                
                
                // vetAlt = [minAlt, mxAlt]
                if (alt) {
                    const vetAlt = alt.split(",");
                    if (vetAlt.length === 1) {
                        if (!(circuitItem.alt === parseInt(vetAlt))) {
                                allMatch = false;
                        } 
                    } else if (vetAlt.length === 2) {
                        if (!(circuitItem.alt >= parseInt(vetAlt[0]) &&
                            circuitItem.alt <= parseInt(vetAlt[1]))) {
                                allMatch = false;
                        }                        
                    } else {
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