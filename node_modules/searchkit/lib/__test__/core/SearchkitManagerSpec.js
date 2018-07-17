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
var _1 = require("../../");
var _ = require("lodash");
describe("SearchkitManager", function () {
    beforeEach(function () {
        _this.host = "http://localhost:9200";
        spyOn(_1.SearchkitManager.prototype, "runInitialSearch").and.callThrough();
        _this.searchkit = new _1.SearchkitManager(_this.host, {
            useHistory: false,
            httpHeaders: {
                "Content-Type": "application/json"
            },
            basicAuth: "key:val",
            searchUrlPath: "/search",
            searchOnLoad: false
        });
        spyOn(_1.SearchRequest.prototype, "run")
            .and.returnValue(Promise.resolve());
        _this.searchkit.setupListeners();
        _this.emitterSpy = jasmine.createSpy("emitter");
        _this.searchkit.emitter.addListener(_this.emitterSpy);
        _this.accessors = _this.searchkit.accessors;
        expect(_this.searchkit.transport.options.searchUrlPath)
            .toBe("/search");
        expect(_1.SearchkitManager.prototype.runInitialSearch)
            .toHaveBeenCalled();
    });
    it("constructor()", function () {
        var semverRegex = /^\d+\.\d+\.\d+-?\w*$/;
        expect(_this.searchkit.VERSION).toMatch(semverRegex);
        expect(_1.SearchkitManager.VERSION).toMatch(semverRegex);
        expect(_this.searchkit.host).toBe(_this.host);
        expect(_this.searchkit.accessors)
            .toEqual(jasmine.any(_1.AccessorManager));
        expect(_this.searchkit.registrationCompleted).toEqual(jasmine.any(Promise));
        expect(_this.searchkit.translateFunction)
            .toEqual(jasmine.any(Function));
        expect(_this.searchkit.transport)
            .toEqual(jasmine.any(_1.AxiosESTransport));
        expect(_this.searchkit.transport.options.headers).toEqual(jasmine.objectContaining({
            "Content-Type": "application/json"
        }));
        expect(_this.searchkit.transport.axios.defaults.auth).toEqual(jasmine.objectContaining({
            "username": "key",
            "password": "val"
        }));
        expect(_this.searchkit.query).toEqual(new _1.ImmutableQuery());
        expect(_this.searchkit.emitter).toEqual(jasmine.any(_1.EventEmitter));
        expect(_this.searchkit.options.searchOnLoad).toBe(false);
        expect(_this.searchkit.initialLoading).toBe(true);
        expect(_this.searchkit.results).toEqual(undefined);
        expect(_this.searchkit.state).toEqual({});
        expect(_this.searchkit.options.withCredentials).toBeFalsy();
        //check queryProcessor is an identity function
        expect(_this.searchkit.queryProcessor("query")).toBe("query");
    });
    it('constructor - withCredentials', function () {
        _this.searchkit = new _1.SearchkitManager(_this.host, {
            useHistory: false,
            httpHeaders: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
            searchUrlPath: "/search",
            searchOnLoad: false
        });
        expect(_this.searchkit.options.withCredentials).toEqual(true);
    });
    it("SearchkitManager.mock()", function () {
        var searchkit = _1.SearchkitManager.mock();
        expect(searchkit.host).toBe("/");
        expect(searchkit.options.useHistory).toBe(false);
        expect(searchkit.options.transport).toEqual(jasmine.any(_1.MockESTransport));
    });
    it("defaultSize", function () {
        var searchkit = _1.SearchkitManager.mock();
        expect(searchkit.buildQuery().getSize()).toEqual(20);
        searchkit = _1.SearchkitManager.mock({ defaultSize: 12 });
        expect(searchkit.buildQuery().getSize()).toEqual(12);
        expect(searchkit.getAccessorByType(_1.PageSizeAccessor).defaultSize).toEqual(12);
    });
    it("addAccessor(), removeAddAccessor()", function () {
        _this.searchkit.accessors = new _1.AccessorManager();
        var accessor = new _1.PageSizeAccessor(10);
        _this.searchkit.addAccessor(accessor);
        expect(_this.searchkit.accessors.accessors).toEqual([
            accessor
        ]);
        _this.searchkit.removeAccessor(accessor);
        expect(_this.searchkit.accessors.accessors)
            .toEqual([]);
    });
    it("addDefaultQuery()", function () {
        var queryFn = function (query) {
            return query.setSize(11);
        };
        _this.searchkit.addDefaultQuery(queryFn);
        expect(_this.searchkit.buildQuery().getSize()).toBe(11);
    });
    it("translate()", function () {
        spyOn(_this.searchkit, "translateFunction")
            .and.callThrough();
        expect(_this.searchkit.translate("foo")).toBe(undefined);
        expect(_this.searchkit.translateFunction)
            .toHaveBeenCalledWith("foo");
    });
    it("buildQuery()", function () {
        _this.searchkit.accessors = new _1.AccessorManager();
        var defaultQueryFn = function (query) {
            return query.setFrom(20);
        };
        _this.searchkit.addDefaultQuery(defaultQueryFn);
        _this.searchkit.addAccessor(new _1.PageSizeAccessor(10));
        var query = _this.searchkit.buildQuery();
        expect(query.getSize()).toBe(10);
        expect(query.getFrom()).toBe(20);
    });
    it("resetState()", function () {
        spyOn(_this.accessors, "resetState");
        _this.searchkit.resetState();
        expect(_this.accessors.resetState)
            .toHaveBeenCalled();
    });
    it("listenToHistory()", function (done) {
        var history = _1.createHistoryInstance();
        history.push(window.location.pathname + "?q=foo");
        _1.SearchkitManager.prototype.unlistenHistory = jasmine.createSpy("unlisten");
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        searchkit.setupListeners();
        expect(_1.SearchkitManager.prototype.unlistenHistory)
            .toHaveBeenCalled();
        spyOn(searchkit.accessors, "setState");
        spyOn(searchkit, "_search");
        searchkit.completeRegistration();
        setTimeout(function () {
            expect(searchkit._search).toHaveBeenCalled();
            expect(searchkit.accessors.setState)
                .toHaveBeenCalledWith({ q: "foo" });
            searchkit.unlistenHistory();
            done();
        }, 0);
    });
    it("listenToHistory() - searchOnLoad false", function (done) {
        var history = _1.createHistoryInstance();
        history.push(window.location.pathname + "?q=foo-previous");
        history.push(window.location.pathname + "?q=foo-now");
        setTimeout(function () {
            var searchkit = new _1.SearchkitManager("/", {
                useHistory: true,
                searchOnLoad: false
            });
            spyOn(searchkit.accessors, "setState");
            spyOn(searchkit, "searchFromUrlQuery");
            spyOn(searchkit, "_search");
            searchkit.setupListeners();
            searchkit.completeRegistration();
            setTimeout(function () {
                history.goBack();
                setTimeout(function () {
                    expect(searchkit.searchFromUrlQuery).toHaveBeenCalledWith("?q=foo-previous");
                    searchkit.unlistenHistory();
                    done();
                }, 10);
            }, 0);
        }, 0);
    });
    it("listenToHistory() - handle error", function (done) {
        var history = _1.createHistoryInstance();
        history.push(window.location.pathname + "?q=foo");
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        searchkit.setupListeners();
        searchkit.searchFromUrlQuery = function () {
            throw new Error("oh no");
        };
        spyOn(console, "error");
        searchkit.completeRegistration();
        setTimeout(function () {
            expect(console.error["calls"].argsFor(0)[0])
                .toContain("searchFromUrlQuery");
            searchkit.unlistenHistory();
            done();
        }, 0);
    });
    it("performSearch()", function () {
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        searchkit.setupListeners();
        searchkit.state = {
            q: "foo"
        };
        spyOn(searchkit.accessors, "notifyStateChange");
        spyOn(searchkit, "_search").and.returnValue(true);
        spyOn(searchkit.history, "push");
        expect(searchkit.performSearch()).toEqual(true);
        expect(searchkit.history.push).toHaveBeenCalledWith("/context.html?q=foo");
        expect(searchkit.accessors.notifyStateChange)
            .toHaveBeenCalledWith(searchkit.state);
        searchkit.unlistenHistory();
    });
    it("run initial search", function (done) {
        var searchkit = new _1.SearchkitManager(_this.host, {
            useHistory: false, searchOnLoad: false
        });
        spyOn(searchkit, "_search");
        expect(_1.SearchkitManager.prototype.runInitialSearch)
            .toHaveBeenCalled();
        searchkit.completeRegistration();
        setTimeout(function () {
            expect(searchkit._search).not.toHaveBeenCalled();
            searchkit.options.searchOnLoad = true;
            searchkit.runInitialSearch();
            setTimeout(function () {
                expect(searchkit._search).toHaveBeenCalled();
                done();
            });
        });
    });
    it("performSearch() - same state + replaceState", function () {
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        searchkit.setupListeners();
        searchkit.state = {
            q: "foo"
        };
        searchkit.accessors.getState = function () {
            return { q: "foo" };
        };
        spyOn(searchkit.accessors, "notifyStateChange");
        spyOn(searchkit, "_search").and.returnValue(true);
        spyOn(searchkit.history, "replace");
        expect(searchkit.performSearch(true)).toEqual(true);
        expect(searchkit.history.replace)
            .toHaveBeenCalled();
        expect(searchkit.accessors.notifyStateChange)
            .not.toHaveBeenCalled();
        searchkit.unlistenHistory();
        searchkit.state = { q: "bar" };
        searchkit.performSearch(true, false);
        expect(searchkit.accessors.notifyStateChange)
            .not.toHaveBeenCalled();
        searchkit.performSearch(true, true);
        expect(searchkit.accessors.notifyStateChange)
            .toHaveBeenCalled();
    });
    it("search()", function () {
        spyOn(_this.searchkit, "performSearch")
            .and.returnValue(true);
        expect(_this.searchkit.search()).toEqual(true);
        expect(_this.searchkit.performSearch)
            .toHaveBeenCalled();
    });
    it("_search()", function () { return __awaiter(_this, void 0, void 0, function () {
        var initialSearchRequest, resultsObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.searchkit.setQueryProcessor(function (query) {
                        query.source = true;
                        return query;
                    });
                    initialSearchRequest = this.searchkit.currentSearchRequest = new _1.SearchRequest(this.host, null, this.searchkit);
                    this.searchkit.results = {};
                    return [4 /*yield*/, this.searchkit._search()];
                case 1:
                    resultsObject = _a.sent();
                    expect(resultsObject).toEqual({
                        results: {},
                        state: {}
                    });
                    expect(initialSearchRequest.active).toBe(false);
                    expect(this.searchkit.currentSearchRequest.transport.host)
                        .toBe(this.host);
                    expect(this.searchkit.currentSearchRequest.query).toEqual({
                        size: 20, source: true
                    });
                    expect(this.searchkit.currentSearchRequest.run)
                        .toHaveBeenCalled();
                    expect(this.searchkit.loading).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("_search() should not search with same query", function () { return __awaiter(_this, void 0, void 0, function () {
        var searchResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.searchkit.query = new _1.ImmutableQuery().setSize(20).setSort([{ "created": "desc" }]);
                    this.searchkit.buildQuery = function () { return new _1.ImmutableQuery().setSize(20).setSort([{ "created": "desc" }]); };
                    this.searchkit.results = {};
                    this.searchkit._search();
                    expect(_1.SearchRequest.prototype.run)
                        .not.toHaveBeenCalled();
                    delete this.searchkit.results;
                    return [4 /*yield*/, this.searchkit._search()];
                case 1:
                    searchResult = _a.sent();
                    expect(searchResult).toEqual({ results: undefined, state: {} });
                    expect(_1.SearchRequest.prototype.run)
                        .toHaveBeenCalled();
                    this.searchkit.query = new _1.ImmutableQuery().setSize(21);
                    this.searchkit.results = {};
                    return [4 /*yield*/, this.searchkit._search()];
                case 2:
                    searchResult = _a.sent();
                    expect(searchResult).toEqual({ results: {}, state: {} });
                    expect(_1.SearchRequest.prototype.run)
                        .toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it("_search() should use shouldSearch check", function () { return __awaiter(_this, void 0, void 0, function () {
        var searchResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.searchkit.buildQuery = function () { return new _1.ImmutableQuery().setSize(20).setSort([{ "created": "desc" }]); };
                    this.searchkit.results = {};
                    this.searchkit.shouldPerformSearch = function (query) {
                        return !!query.getQueryString();
                    };
                    return [4 /*yield*/, this.searchkit._search()];
                case 1:
                    searchResult = _a.sent();
                    expect(searchResult).toEqual({ results: {}, state: {} });
                    expect(_1.SearchRequest.prototype.run)
                        .not.toHaveBeenCalled();
                    this.searchkit.buildQuery = function () { return new _1.ImmutableQuery()
                        .setSize(20).setSort([{ "created": "desc" }])
                        .setQueryString("somequery"); };
                    return [4 /*yield*/, this.searchkit._search()];
                case 2:
                    searchResult = _a.sent();
                    expect(searchResult).toEqual({ results: {}, state: {} });
                    expect(_1.SearchRequest.prototype.run)
                        .toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it("reloadSearch()", function () {
        _this.searchkit.query = new _1.ImmutableQuery().setSize(20).setSort([{ "created": "desc" }]);
        _this.searchkit.buildQuery = function () { return new _1.ImmutableQuery().setSize(20).setSort([{ "created": "desc" }]); };
        _this.searchkit.results = {};
        _this.searchkit._search();
        expect(_1.SearchRequest.prototype.run)
            .not.toHaveBeenCalled();
        _this.searchkit.reloadSearch();
        expect(_1.SearchRequest.prototype.run)
            .toHaveBeenCalled();
    });
    it("setResults()", function () {
        spyOn(_this.accessors, "setResults");
        spyOn(_this.searchkit, "onResponseChange");
        expect(_this.searchkit.results).toBe(undefined);
        var resultsSpy = jasmine.createSpy("results");
        var removalFn = _this.searchkit.addResultsListener(resultsSpy);
        expect(removalFn).toEqual(jasmine.any(Function));
        _this.searchkit.setResults("foo");
        expect(_this.searchkit.results).toBe("foo");
        expect(_this.accessors.setResults)
            .toHaveBeenCalledWith("foo");
        expect(_this.searchkit.onResponseChange)
            .toHaveBeenCalled();
        expect(resultsSpy).toHaveBeenCalledWith("foo");
    });
    it("setResults() - error", function () {
        spyOn(_this.searchkit, "onResponseChange");
        spyOn(_this.accessors, "setResults");
        spyOn(console, "error");
        expect(_this.searchkit.results).toBe(undefined);
        var error = new Error("oh no");
        _this.searchkit.setError(error);
        expect(_this.searchkit.error).toBe(error);
        expect(console.error).toHaveBeenCalledWith(error);
        expect(_this.searchkit.results).toBe(null);
        expect(_this.accessors.setResults)
            .toHaveBeenCalledWith(null);
        expect(_this.searchkit.onResponseChange)
            .toHaveBeenCalled();
    });
    it("setResults() - change detection", function () {
        spyOn(_this.accessors, "setResults");
        spyOn(_this.searchkit, "onResponseChange");
        var results = {
            hits: {
                total: 2,
                hits: [
                    { _id: 1, _source: { title: "Doc1" } },
                    { _id: 2, _source: { title: "Doc2" } }
                ]
            }
        };
        _this.searchkit.setResults(_.cloneDeep(results));
        expect(_this.searchkit.results.hits.ids).toBe("1,2");
        expect(_this.searchkit.results.hits.hasChanged).toBe(true);
        expect(_this.searchkit.hasHitsChanged()).toBe(true);
        _this.searchkit.setResults(_.cloneDeep(results));
        expect(_this.searchkit.hasHitsChanged()).toBe(false);
        results.hits.hits.push({ _id: 3, _source: { title: "Doc3" } });
        _this.searchkit.setResults(_.cloneDeep(results));
        expect(_this.searchkit.results.hits.ids).toBe("1,2,3");
        expect(_this.searchkit.hasHitsChanged()).toBe(true);
    });
    it("guid()", function () {
        expect(_this.searchkit.guid("foo")).toEqual("foo1");
        expect(_this.searchkit.guid("bar")).toEqual("bar2");
    });
    it("getHits()", function () {
        expect(_this.searchkit.getHits()).toEqual([]);
        _this.searchkit.results = {
            hits: {
                hits: [1, 2, 3, 4]
            }
        };
        expect(_this.searchkit.getHits()).toEqual([1, 2, 3, 4]);
    });
    it("getHitsCount(), hasHits()", function () {
        expect(_this.searchkit.getHitsCount()).toEqual(0);
        expect(_this.searchkit.hasHits()).toBe(false);
        _this.searchkit.results = {
            hits: {
                total: 99
            },
            took: 1
        };
        expect(_this.searchkit.getHitsCount()).toBe(99);
        expect(_this.searchkit.getTime()).toBe(1);
        expect(_this.searchkit.hasHits()).toBe(true);
    });
    it("getQueryAccessor()", function () {
        var queryAccessor = new _1.QueryAccessor("q");
        _this.searchkit.addAccessor(queryAccessor);
        expect(_this.searchkit.getQueryAccessor()).toBe(queryAccessor);
    });
    it("getAccessorsByType(), getAccessorByType()", function () {
        var queryAccessor = new _1.QueryAccessor("q");
        _this.searchkit.addAccessor(queryAccessor);
        expect(_this.searchkit.getAccessorsByType(_1.QueryAccessor))
            .toEqual([queryAccessor]);
        expect(_this.searchkit.getAccessorByType(_1.QueryAccessor))
            .toEqual(queryAccessor);
    });
    it("onResponseChange()", function () {
        _this.searchkit.loading = true;
        _this.searchkit.initialLoading = true;
        _this.searchkit.onResponseChange();
        expect(_this.searchkit.loading).toBe(false);
        expect(_this.searchkit.initialLoading).toBe(false);
        expect(_this.emitterSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=SearchkitManagerSpec.js.map