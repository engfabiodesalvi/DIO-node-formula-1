import { FastifyReply, FastifyRequest } from "fastify";
import { listSeasons } from "./load-seasons-repository";

// GET - List all seasons and Find seasons using query parameters
export const repositoryListSeasons = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the seasons values
            const { 
                year, url
            } = request.query as any;

            // To verify sended values
            // console.log(JSON.stringify({
            //    year, url
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            //console.log(JSON.stringify(request.body, null, 2)); 

            //console.log(`${typeof(year) === 'string'}`)
            //console.log(`${Number.isInteger(parseFloat(year))} - ${year}`);

            const seasons = listSeasons.filter((seasonItem) => {
                let allMatch = true;
                    
                // Comparing values
                if (year) {
                    if (!(seasonItem.year === parseInt(year)) ||                
                        !((parseInt(year) > 0)) ||
                        !(Number.isInteger(parseFloat(year)))) {
                        allMatch = false;
                    }
                }
                
                if (url?.length > 0) {
                    if(!(seasonItem.url.toLowerCase()
                        .includes(url.toLowerCase()))) {
                        allMatch = false;
                    }
                }           

                return allMatch;
            });

            if (!(seasons.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Season Not Found" };
            } else {
                response.type("application/json").code(200);
                return { seasons };
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