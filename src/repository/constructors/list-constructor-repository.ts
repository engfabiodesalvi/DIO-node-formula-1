import { FastifyReply, FastifyRequest } from "fastify";
import { listConstructors } from "./load-constructor-repository";


// GET - List all constructors and Find constructors using query parameters
export const repositoryListConstructors = async (
    request: FastifyRequest,
    response: FastifyReply,   
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {    

            // reading the constructors values
            const { 
                constructorId, constructorRef, name,
                natinality, url
            } = request.query as any;

            // // To verify sended values
            // console.log(JSON.stringify({
            //    constructorId, constructorRef, name,
            //    natinality, url
            // }, null, 2));
            // console.log(JSON.stringify(request.query, null, 2));    
            // console.log(JSON.stringify(request.body, null, 2)); 

            // console.log(`${typeof(constructorId) === 'string'}`)
            // console.log(`${Number.isInteger(parseFloat(constructorId))} - ${constructorId}`);

            const constructors = listConstructors.filter((constructorsItem) => {
                let allMatch = true;                
                    
                // Comparing values
                if (constructorId) {
                    if (!(constructorsItem.constructorId === parseInt(constructorId)) ||                
                        !((parseInt(constructorId) > 0)) ||
                        !(Number.isInteger(parseFloat(constructorId)))) {
                        allMatch = false;
                    }
                }

                if (constructorRef?.length > 0) {
                    if(!(constructorsItem.constructorRef.toLowerCase()
                        .includes(constructorRef.toLowerCase()))) {
                        allMatch = false;
                    }
                }   

                if (name?.length > 0) {
                    if(!(constructorsItem.name.toLowerCase()
                        .includes(name.toLowerCase()))) {
                        allMatch = false;
                    }
                }   

                if (natinality?.length > 0) {
                    if(!(constructorsItem.nationality.toLowerCase()
                        .includes(natinality.toLowerCase()))) {
                        allMatch = false;
                    }
                }   

                if (url?.length > 0) {
                    if(!(constructorsItem.url.toLowerCase()
                        .includes(url.toLowerCase()))) {
                        allMatch = false;
                    }
                }   

                return allMatch;
            });

            if (!(constructors.length > 0)) {
                response.type("application/json").code(404);
                return { message: "Constructor Not Found" };
            } else {
                response.type("application/json").code(200);
                return { constructors };
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