"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var server = new index_js_1.Server({
    name: 'Spark-Customer-Agent',
    version: '0.3.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Backend configuration
var BACKEND_BASE_URL = 'http://localhost:3000';
// Available product categories from your backend
var ALLOWED_CATEGORIES = [
    'smartphones',
    'tv',
    'shoes',
    'healthcare',
    'electronics',
    'fitness'
];
// Tool definitions
var TOOLS = {
    get_products_by_category: {
        name: 'get_products_by_category',
        description: "Fetch all products from a specific category. Available categories: ".concat(ALLOWED_CATEGORIES.join(', ')),
        inputSchema: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: "The category name. Must be one of: ".concat(ALLOWED_CATEGORIES.join(', ')),
                    enum: ALLOWED_CATEGORIES,
                },
            },
            required: ['category'],
        },
    },
    get_smartphones_by_price: {
        name: 'get_smartphones_by_price',
        description: 'Filter smartphones by maximum price. This endpoint specifically filters smartphones only.',
        inputSchema: {
            type: 'object',
            properties: {
                maxPrice: {
                    type: 'number',
                    description: 'Maximum price to filter smartphones (e.g., 30000)',
                    minimum: 0,
                },
            },
            required: ['maxPrice'],
        },
    },
    get_cart_items: {
        name: 'get_cart_items',
        description: 'Fetch all items currently in the shopping cart',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    get_available_coupons: {
        name: 'get_available_coupons',
        description: 'Fetch all available coupons and discount codes',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    get_order_history: {
        name: 'get_order_history',
        description: 'Fetch order history and transaction details',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
};
// Helper function to make HTTP requests
function makeHttpRequest(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options) {
        var response, errorData, errorData, data, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: __assign({ 'Content-Type': 'application/json' }, options.headers) }))];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 404)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Not found' }); })];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.message || 'Resource not found');
                case 3:
                    if (!!response.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.json().catch(function () { return ({ error: 'Request failed' }); })];
                case 4:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "HTTP error! status: ".concat(response.status));
                case 5: return [4 /*yield*/, response.json()];
                case 6:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 7:
                    error_1 = _a.sent();
                    console.error('HTTP request failed:', error_1);
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Helper function to create standardized responses
function createResponse(success, data, message, error) {
    return JSON.stringify({
        success: success,
        data: data || null,
        message: message || (success ? 'Request completed successfully' : 'Request failed'),
        error: error || null,
        timestamp: new Date().toISOString(),
    }, null, 2);
}
// Tool handlers
function handleGetProductsByCategory(category) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, error_2, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Validate category
                    if (!ALLOWED_CATEGORIES.includes(category)) {
                        return [2 /*return*/, createResponse(false, null, "Invalid category: ".concat(category, ". Available categories: ").concat(ALLOWED_CATEGORIES.join(', ')), 'Invalid category')];
                    }
                    url = "".concat(BACKEND_BASE_URL, "/products/").concat(encodeURIComponent(category));
                    return [4 /*yield*/, makeHttpRequest(url)];
                case 1:
                    data = _a.sent();
                    // Handle array response from MongoDB
                    if (Array.isArray(data)) {
                        return [2 /*return*/, createResponse(true, data, "Successfully fetched ".concat(data.length, " products for category: ").concat(category))];
                    }
                    return [2 /*return*/, createResponse(true, data, "Successfully fetched products for category: ".concat(category))];
                case 2:
                    error_2 = _a.sent();
                    errorMsg = error_2 instanceof Error ? error_2.message : 'Unknown error occurred';
                    return [2 /*return*/, createResponse(false, null, "Failed to fetch products for category: ".concat(category), errorMsg)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleGetSmartphonesByPrice(maxPrice) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, error_3, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (maxPrice < 0) {
                        return [2 /*return*/, createResponse(false, null, 'Price must be a positive number', 'Invalid price')];
                    }
                    url = "".concat(BACKEND_BASE_URL, "/products/smartphones/").concat(maxPrice);
                    return [4 /*yield*/, makeHttpRequest(url)];
                case 1:
                    data = _a.sent();
                    // Handle array response from MongoDB
                    if (Array.isArray(data)) {
                        return [2 /*return*/, createResponse(true, data, "Successfully fetched ".concat(data.length, " smartphones under \u20B9").concat(maxPrice))];
                    }
                    return [2 /*return*/, createResponse(true, data, "Successfully fetched smartphones under \u20B9".concat(maxPrice))];
                case 2:
                    error_3 = _a.sent();
                    errorMsg = error_3 instanceof Error ? error_3.message : 'Unknown error occurred';
                    return [2 /*return*/, createResponse(false, null, "Failed to fetch smartphones under \u20B9".concat(maxPrice), errorMsg)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleGetCartItems() {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, totalItems, message, error_4, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "".concat(BACKEND_BASE_URL, "/cart");
                    return [4 /*yield*/, makeHttpRequest(url)];
                case 1:
                    data = _a.sent();
                    // Handle array response from MongoDB
                    if (Array.isArray(data)) {
                        totalItems = data.length;
                        message = totalItems === 0 ? 'Cart is empty' : "Successfully fetched ".concat(totalItems, " items from cart");
                        return [2 /*return*/, createResponse(true, data, message)];
                    }
                    return [2 /*return*/, createResponse(true, data, 'Successfully fetched cart items')];
                case 2:
                    error_4 = _a.sent();
                    errorMsg = error_4 instanceof Error ? error_4.message : 'Unknown error occurred';
                    // Handle empty cart case
                    if (errorMsg.includes('Cart is empty')) {
                        return [2 /*return*/, createResponse(true, [], 'Cart is empty')];
                    }
                    return [2 /*return*/, createResponse(false, null, 'Failed to fetch cart items', errorMsg)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleGetAvailableCoupons() {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, totalCoupons, message, error_5, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "".concat(BACKEND_BASE_URL, "/coupons");
                    return [4 /*yield*/, makeHttpRequest(url)];
                case 1:
                    data = _a.sent();
                    // Handle array response from MongoDB
                    if (Array.isArray(data)) {
                        totalCoupons = data.length;
                        message = totalCoupons === 0 ? 'No coupons available' : "Successfully fetched ".concat(totalCoupons, " available coupons");
                        return [2 /*return*/, createResponse(true, data, message)];
                    }
                    return [2 /*return*/, createResponse(true, data, 'Successfully fetched available coupons')];
                case 2:
                    error_5 = _a.sent();
                    errorMsg = error_5 instanceof Error ? error_5.message : 'Unknown error occurred';
                    // Handle no coupons case
                    if (errorMsg.includes('No coupons available')) {
                        return [2 /*return*/, createResponse(true, [], 'No coupons available')];
                    }
                    return [2 /*return*/, createResponse(false, null, 'Failed to fetch available coupons', errorMsg)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleGetOrderHistory() {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, totalOrders, message, error_6, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "".concat(BACKEND_BASE_URL, "/orders");
                    return [4 /*yield*/, makeHttpRequest(url)];
                case 1:
                    data = _a.sent();
                    // Handle array response from MongoDB
                    if (Array.isArray(data)) {
                        totalOrders = data.length;
                        message = totalOrders === 0 ? 'No orders available' : "Successfully fetched ".concat(totalOrders, " orders from history");
                        return [2 /*return*/, createResponse(true, data, message)];
                    }
                    return [2 /*return*/, createResponse(true, data, 'Successfully fetched order history')];
                case 2:
                    error_6 = _a.sent();
                    errorMsg = error_6 instanceof Error ? error_6.message : 'Unknown error occurred';
                    // Handle no orders case
                    if (errorMsg.includes('No orders available')) {
                        return [2 /*return*/, createResponse(true, [], 'No orders available')];
                    }
                    return [2 /*return*/, createResponse(false, null, 'Failed to fetch order history', errorMsg)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                tools: Object.values(TOOLS),
            }];
    });
}); });
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, result, _b, error_7, errorMessage;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = request.params, name = _a.name, args = _a.arguments;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 14, , 15]);
                result = void 0;
                _b = name;
                switch (_b) {
                    case 'get_products_by_category': return [3 /*break*/, 2];
                    case 'get_smartphones_by_price': return [3 /*break*/, 4];
                    case 'get_cart_items': return [3 /*break*/, 6];
                    case 'get_available_coupons': return [3 /*break*/, 8];
                    case 'get_order_history': return [3 /*break*/, 10];
                }
                return [3 /*break*/, 12];
            case 2:
                if (!(args === null || args === void 0 ? void 0 : args.category)) {
                    throw new Error('Category parameter is required');
                }
                return [4 /*yield*/, handleGetProductsByCategory(args === null || args === void 0 ? void 0 : args.category)];
            case 3:
                result = _c.sent();
                return [3 /*break*/, 13];
            case 4:
                if (!(args === null || args === void 0 ? void 0 : args.maxPrice)) {
                    throw new Error('maxPrice parameter is required');
                }
                return [4 /*yield*/, handleGetSmartphonesByPrice(args === null || args === void 0 ? void 0 : args.maxPrice)];
            case 5:
                result = _c.sent();
                return [3 /*break*/, 13];
            case 6: return [4 /*yield*/, handleGetCartItems()];
            case 7:
                result = _c.sent();
                return [3 /*break*/, 13];
            case 8: return [4 /*yield*/, handleGetAvailableCoupons()];
            case 9:
                result = _c.sent();
                return [3 /*break*/, 13];
            case 10: return [4 /*yield*/, handleGetOrderHistory()];
            case 11:
                result = _c.sent();
                return [3 /*break*/, 13];
            case 12: throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, "Unknown tool: ".concat(name));
            case 13: return [2 /*return*/, {
                    content: [
                        {
                            type: 'text',
                            text: result,
                        },
                    ],
                }];
            case 14:
                error_7 = _c.sent();
                errorMessage = error_7 instanceof Error ? error_7.message : 'Unknown error';
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: createResponse(false, null, "Tool execution failed: ".concat(name), errorMessage),
                            },
                        ],
                    }];
            case 15: return [2 /*return*/];
        }
    });
}); });
// Start the server
function runServer() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error('Product Backend MCP server running on stdio');
                    return [2 /*return*/];
            }
        });
    });
}
runServer().catch(function (error) {
    console.error('Failed to run server:', error);
    process.exit(1);
});
