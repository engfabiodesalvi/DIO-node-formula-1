import { FastifyReply, FastifyRequest } from "fastify";
import { ConstructorModel } from "../../models/data/constructor";
import { listConstructors } from "./load-constructor-repository";
import { ConstructorParams } from "../../models/params/constructor-params-model";


// GET - Find constructor by Id
export const repositoryFindConstructorById = async (
    request: FastifyRequest,
    response: FastifyReply,      
) => {
    const userToken = request.headers.authorization?.split(" ")[1] || "";
    const reqBody = request.body as any;

    // verify if has Token data
    if (userToken.length > 0) {

        // verify if Token is ok
        if (userToken === process.env.USERTOKEN) {

            // partially initialized variable
            let constructors:Partial<ConstructorModel> = {};
            if (listConstructors.length > 0) { 
                const constructorParams = request.params as ConstructorParams;
                if (constructorParams.constructorId) {
                    const constructorId = parseInt(constructorParams.constructorId) || 0;
                    if ((constructorId > 0) && Number.isInteger(parseFloat(constructorParams.constructorId) || 0)) {
                        constructors = listConstructors.find((constructorItem) => {              
                            if (constructorId > 0) {
                                if (!(constructorItem.constructorId === constructorId)) {
                                    console.info(`${constructorItem.constructorId} - ${constructorId}`);
                                    return false;            
                                } else {
                                    return true;
                                }
                            } 
                        }) as ConstructorModel;
                    } else {
                        response.type("application/json").code(400); // bad request
                        return {
                            "message": `[constructorId: ${constructorParams.constructorId}] must be a positive integer number!`};                              
                    }

                } else {
                    response.type("application/json").code(400); // bad request
                    return {"message": "Send constructorId to be find!"} 
                }
            }

            if (!(constructors)) {
                response.type("application/json").code(404);
                return { message: "Constructor Standing Not Found" };
            } else {
                response.type("application/json").code(200);
                return { "constructors": constructors };
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