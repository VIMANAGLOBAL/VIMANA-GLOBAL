import * as httpMocks from "node-mocks-http";

import {Request as ExpressRequest} from "express";

import {Request} from "../../../src/backend/types";
import {requestMiddleware} from "../../../src/backend/middleware/request";
import Mock = jest.Mock;

describe("request", (): void => {
    describe("requestMiddleware", (): void => {
        it("should apply id, release method to request object and call next function", (): void => {
            const request: ExpressRequest = httpMocks.createRequest();
            const next: Mock<void> = jest.fn<void>();

            requestMiddleware(request, undefined, next);

            const identifiedRequest: Request = request as Request;

            expect(identifiedRequest.id).toBeDefined();
            expect(typeof identifiedRequest.id).toEqual("string");
            expect(identifiedRequest.release).toBeDefined();
            expect(typeof identifiedRequest.release).toEqual("function");
            expect(next.mock.calls.length).toEqual(1);
        });
    });
});
