"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (event) => {
    const followService = new FollowService_1.FollowService();
    let request;
    if (event.body) {
        request = JSON.parse(event.body);
    }
    else {
        request = event;
    }
    const response = await followService.getIsFollowerStatus(request);
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(response)
    };
};
exports.handler = handler;
