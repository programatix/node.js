import express, { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import { FieldValidationError } from 'express-validator';

const defaultProblemDetails = {
    /**
     * This is the only URI reserved as a problem type in the
     * problem details spec. It indicates that the problem has
     * no additional semantics beyond that of the HTTP status code.
     */
    type: "about:blank",
    status: 500,
};

const problemTypes = [
    {
        matchErrorClass: createHttpError.NotFound,
        details: {
            type: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.5",
        },
    },
    {
        matchErrorClass: createHttpError.BadRequest,
        details: {
            type: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1",
        },
    },
    {
        matchErrorClass: createHttpError.Forbidden,
        details: {
            type: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4",
        },
    },
];

/**
 * Get the problem details which have been defined for an error.
 *
 * @param {Error} error
 * @return {Object} - Problem details (type, title, status)
 */
function getProblemDetailsForError(error: HttpError) {
    const problemType = problemTypes.find((problemType) => {
        /**
         * Test if the error object is an instance of the error
         * class specified by the problem type.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
         */
        return error instanceof problemType.matchErrorClass;
    });

    if (!problemType) {
        /**
         * A problem type hasn't been defined for the type of error 
         * this function has received so return fallback problem details.
         */
        return defaultProblemDetails;
    }

    const a = error.invalidParams?.map((p: FieldValidationError) => {
        return {
            name: p.path,
            reason: p.msg
        };
    });

    return {
        type: problemType == null ? defaultProblemDetails.type : problemType.details.type,
        status: error.status,
        title: error.message,
        "invalid-params": error.invalidParams?.map((p: FieldValidationError) => { return { name: p.path, reason: p.msg } })
    };
}

/**
 * Send an error response using the problem details format.
 *
 * @see https://tools.ietf.org/html/rfc7807
 *
 * @param {Error} error
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express callback function
 */
function problemDetailsResponseMiddleware(
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction
) {
    /**
     * If response headers have already been sent,
     * delegate to the default Express error handler.
     */
    if (response.headersSent) {
        return next(error);
    }

    const problemDetails = getProblemDetailsForError(error);

    /**
     * If the problem details don't contain an HTTP status code,
     * let's check the error object for a status code. If the
     * error object doesn't have one then we'll fall back to a
     * generic 500 (Internal Server Error) status code.
     */
    if (!problemDetails.status) {
        problemDetails.status = error.statusCode || 500;
    }

    /**
     * Set the correct media type for a response containing a
     * JSON formatted problem details object.
     *
     * @see https://tools.ietf.org/html/rfc7807#section-3
     */
    response.set("Content-Type", "application/problem+json");

    /**
     * Set the response status code and a JSON formatted body
     * containing the problem details.
     */
    response.status(problemDetails.status).json(problemDetails);

    /**
     * Ensure any remaining middleware are run.
     */
    next();
};

export default problemDetailsResponseMiddleware;