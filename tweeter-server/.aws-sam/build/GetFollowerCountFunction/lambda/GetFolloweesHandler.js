"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
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
    let deserializedLastItem = null;
    if (request.lastItem) {
        deserializedLastItem = tweeter_shared_1.User.fromJson(JSON.stringify(request.lastItem));
    }
    const requestWithObject = {
        ...request,
        lastItem: deserializedLastItem
    };
    const response = await followService.loadMoreFollowees(requestWithObject);
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
