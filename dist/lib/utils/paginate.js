"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPaginateResponse = exports.getPaginateOptionsWithSort = exports.getPaginateOptions = void 0;
const getPaginateOptions = (page, limit, options) => {
    return Object.assign({ page: parseInt(String(page), 10), limit: parseInt(String(limit), 10), sort: { createdAt: -1 } }, options);
};
exports.getPaginateOptions = getPaginateOptions;
const getPaginateOptionsWithSort = (page, limit, options = {}) => {
    return Object.assign({ page: parseInt(String(page), 10), limit: parseInt(String(limit), 10), sort: Object.assign({ createdAt: -1 }, (options.sort || {})) }, options);
};
exports.getPaginateOptionsWithSort = getPaginateOptionsWithSort;
const transformPaginateResponse = (data) => {
    return {
        data: data.docs,
        totalDocs: data.totalDocs,
        limit: data.limit,
        totalPages: data.totalPages,
        page: data.page,
        pagingCounter: data.pagingCounter,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevPage: data.prevPage,
        nextPage: data.nextPage
    };
};
exports.transformPaginateResponse = transformPaginateResponse;
