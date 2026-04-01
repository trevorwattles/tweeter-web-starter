import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: any): Promise<LoginResponse> => {
    const userService = new UserService();
    let request: LoginRequest;
    
    if (event.body) {
        request = JSON.parse(event.body);
    } else {
        request = event;
    }
    
    const response = await userService.login(request);
    
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(response)
    } as any;
};
