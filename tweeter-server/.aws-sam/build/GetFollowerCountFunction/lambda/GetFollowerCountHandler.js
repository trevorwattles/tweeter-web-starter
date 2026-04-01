"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const factory = new DynamoDAOFactory_1.DynamoDAOFactory();
    const followService = new FollowService_1.FollowService(factory);
    let request;
    if (event.body) {
        request = JSON.parse(event.body);
    }
    else {
        request = event;
    }
    try {
        const response = await followService.getFollowerCount(request);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(response)
        };
    }
    catch (e) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
                success: false,
                message: e.message,
                errorMessage: e.message
            })
        };
    }
};
exports.handler = handler;
