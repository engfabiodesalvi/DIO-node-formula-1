import { FastifyReply, FastifyRequest } from "fastify";
import { listDrivers } from "./load-drivers-repository";

// GET - List all drivers and Find drivers using query parameters
export const repositoryListDrivers = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the drivers values
            const { 
                driverId, driverRef, number, code, forename,
                surname, dob, nationality, url 
            } = request.query as any;

            // To verify sended values
            // console.log(JSON.stringify({
            //     driverId, driverRef, number, code, forename,
            //     surname, dob, nationality, url 
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            //console.log(JSON.stringify(request.body, null, 2)); 

            //console.log(`${typeof(driverId) === 'string'}`)
            //console.log(`${Number.isInteger(parseFloat(driverId))} - ${driverId}`);

            const drivers = listDrivers.filter((driverItem) => {
                let allMatch = true;
                    
                // Comparing values
                if (driverId) {
                    if (!(driverItem.driverId === parseInt(driverId)) ||                
                        !((parseInt(driverId) > 0)) ||
                        !(Number.isInteger(parseFloat(driverId)))) {
                        allMatch = false;
                    }
                }

                if (driverRef?.length > 0) {
                    if(!(driverItem.driverRef.includes(driverRef))) {
                        allMatch = false;
                    }
                }

                if (number) {
                    if (!(driverItem.number === parseInt(number)) ||
                    !(parseInt(number) > 0) ||
                    !Number.isInteger(parseFloat(number))) {
                        allMatch = false;
                    }
                }

                if (code?.length > 0) {
                    if(!(driverItem.code.includes(code))) {
                        allMatch = false;
                    }
                }     
                
                if (forename?.length > 0) {
                    if(!(driverItem.forename.includes(forename))) {
                        allMatch = false;
                    }
                }         

                if (surname?.length > 0) {
                    if(!(driverItem.surname.includes(surname))) {
                        allMatch = false;
                    }
                }  

                if (dob?.length > 0) {
                    if(!(driverItem.dob.includes(dob))) {
                        allMatch = false;
                    }
                }          

                if (nationality?.length > 0) {
                    if(!(driverItem.nationality.includes(nationality))) {
                        allMatch = false;
                    }
                }   
                
                if (url?.length > 0) {
                    if(!(driverItem.url.includes(url))) {
                        allMatch = false;
                    }
                }           

                return allMatch;
            });

            if (!(drivers.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Driver Not Found" };
            } else {
                response.type("application/json").code(200);
                return { drivers };
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