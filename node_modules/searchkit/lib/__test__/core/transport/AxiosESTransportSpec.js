var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../");
var axios_1 = require("axios");
var sinon = require("sinon");
describe("AxiosESTransport", function () {
    beforeEach(function () {
        _this.host = "http://search:9200/";
        _this.server = sinon.fakeServer.create();
        _this.mockResults = { hits: [1, 2, 3] };
        _this.server.respondWith("POST", /search/, [200, { "Content-Type": "application/json" },
            JSON.stringify(_this.mockResults)]);
        _this.server.autoRespond = true;
        _this.transport = new _1.AxiosESTransport(_this.host);
    });
    afterEach(function () {
        _this.server.restore();
    });
    it("constructor()", function () {
        expect(_this.transport.host).toBe(_this.host);
        expect(_this.transport.options.headers).toEqual({});
        var axiosConfig = _this.transport.axios.defaults;
        expect(axiosConfig.baseURL).toBe(_this.host);
        expect(axiosConfig.timeout).toBe(_1.AxiosESTransport.timeout);
        expect(axiosConfig.headers).toEqual(axios_1.default.defaults.headers);
        expect(_this.transport instanceof _1.ESTransport).toBe(true);
    });
    it("constructor() - additional options", function () {
        var transport = new _1.AxiosESTransport(_this.host, {
            headers: {
                "Content-Type": "application/json",
            },
            basicAuth: "key:val",
            searchUrlPath: "/_search/",
            timeout: 10000
        });
        expect(transport.options.headers).toEqual({
            "Content-Type": "application/json"
        });
        expect(transport.axios.defaults.auth.username).toBe("key");
        expect(transport.axios.defaults.auth.password).toBe("val");
        expect(transport.options.timeout).toEqual(10000);
        expect(transport.options.searchUrlPath).toBe("/_search/");
    });
    it("search()", function () { return __awaiter(_this, void 0, void 0, function () {
        var result, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.transport = new _1.AxiosESTransport(this.host, {
                        searchUrlPath: "/search"
                    });
                    return [4 /*yield*/, this.transport.search({
                            size: 10,
                            from: 0
                        })];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(this.mockResults);
                    request = this.server.requests[0];
                    expect(request.method).toBe("POST");
                    expect(request.url).toEqual(this.host + "search");
                    this.server.restore();
                    return [2 /*return*/];
            }
        });
    }); });
    it("search - basicAuth", function () { return __awaiter(_this, void 0, void 0, function () {
        var result, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.transport = new _1.AxiosESTransport(this.host, {
                        searchUrlPath: "/search",
                        basicAuth: 'user:pass'
                    });
                    return [4 /*yield*/, this.transport.search({
                            size: 10,
                            from: 0
                        })];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(this.mockResults);
                    request = this.server.requests[0];
                    expect(request.requestHeaders['Authorization'])
                        .toEqual("Basic " + btoa("user:pass"));
                    return [2 /*return*/];
            }
        });
    }); });
    it("search - withCredentials", function () { return __awaiter(_this, void 0, void 0, function () {
        var result, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document.cookie = axios_1.default.defaults.xsrfCookieName + '=12345';
                    this.transport = new _1.AxiosESTransport(this.host, {
                        searchUrlPath: "/search",
                        withCredentials: true
                    });
                    return [4 /*yield*/, this.transport.search({
                            size: 10,
                            from: 0
                        })];
                case 1:
                    result = _a.sent();
                    request = this.server.requests[0];
                    expect(request.requestHeaders[axios_1.default.defaults.xsrfHeaderName]).toEqual('12345');
                    return [2 /*return*/];
            }
        });
    }); });
    it("test timeout", function () {
        _1.AxiosESTransport.timeout = 10;
        _this.transport = new _1.AxiosESTransport(_this.host);
        expect(_this.transport.axios.defaults.timeout)
            .toEqual(10);
    });
});
//# sourceMappingURL=AxiosESTransportSpec.js.map