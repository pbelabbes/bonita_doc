var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../");
var FilterAccessor = /** @class */ (function (_super) {
    __extends(FilterAccessor, _super);
    function FilterAccessor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = new _1.ObjectState();
        return _this;
    }
    return FilterAccessor;
}(_1.FilterBasedAccessor));
describe("ResetSearchAccessor", function () {
    beforeEach(function () {
        _this.searchkit = _1.SearchkitManager.mock();
        _this.accessor = new _1.ResetSearchAccessor();
        _this.searchkit.addAccessor(_this.accessor);
        _this.query = new _1.ImmutableQuery();
    });
    it("constructor()", function () {
        expect(_this.accessor.options).toEqual({
            query: true, filter: true, pagination: true
        });
        var accessor = new _1.ResetSearchAccessor({ query: true });
        expect(accessor.options).toEqual({
            query: true
        });
    });
    it("canReset()", function () {
        var options = { query: true, filter: true, pagination: true };
        _this.accessor.options = options;
        _this.searchkit.query = new _1.ImmutableQuery();
        expect(_this.accessor.canReset()).toBe(false);
        _this.searchkit.query = new _1.ImmutableQuery().setQueryString("foo");
        expect(_this.accessor.canReset()).toBe(true);
        options.query = false;
        expect(_this.accessor.canReset()).toBe(false);
        _this.searchkit.query = new _1.ImmutableQuery().addSelectedFilter({
            id: "foo", name: "fooname", value: "foovalue", remove: function () { }
        });
        expect(_this.accessor.canReset()).toBe(true);
        options.filter = false;
        expect(_this.accessor.canReset()).toBe(false);
        _this.searchkit.query = new _1.ImmutableQuery().setFrom(10);
        expect(_this.accessor.canReset()).toBe(true);
        options.pagination = false;
        expect(_this.accessor.canReset()).toBe(false);
    });
    it("performReset()", function () {
        var queryAccessor = _this.searchkit.getQueryAccessor();
        spyOn(queryAccessor, "resetState");
        var filterAccessor1 = new FilterAccessor("f1");
        spyOn(filterAccessor1, "resetState");
        var filterAccessor2 = new FilterAccessor("f2");
        spyOn(filterAccessor2, "resetState");
        var searchInputAccessor = new _1.QueryAccessor("s", { addToFilters: true });
        var paginationAccessor = new _1.PaginationAccessor("p");
        spyOn(paginationAccessor, "resetState");
        _this.searchkit.addAccessor(filterAccessor1);
        _this.searchkit.addAccessor(filterAccessor2);
        _this.searchkit.addAccessor(searchInputAccessor);
        _this.searchkit.addAccessor(paginationAccessor);
        searchInputAccessor.state = searchInputAccessor.state.setValue("foo");
        _this.searchkit.query = _this.searchkit.buildQuery();
        _this.accessor.options = { query: false, filter: false };
        _this.accessor.performReset();
        expect(queryAccessor.resetState).not.toHaveBeenCalled();
        expect(filterAccessor1.resetState).not.toHaveBeenCalled();
        expect(filterAccessor2.resetState).not.toHaveBeenCalled();
        expect(searchInputAccessor.state.getValue()).toBe("foo");
        _this.accessor.options = { query: true, filter: false };
        _this.accessor.performReset();
        expect(queryAccessor.resetState).toHaveBeenCalled();
        expect(filterAccessor1.resetState).not.toHaveBeenCalled();
        expect(filterAccessor2.resetState).not.toHaveBeenCalled();
        expect(searchInputAccessor.state.getValue()).toBe("foo");
        _this.accessor.options = { query: true, filter: true };
        _this.accessor.performReset();
        expect(filterAccessor1.resetState).toHaveBeenCalled();
        expect(filterAccessor2.resetState).toHaveBeenCalled();
        expect(paginationAccessor.resetState).not.toHaveBeenCalled();
        expect(searchInputAccessor.state.getValue()).toBe(null);
        _this.accessor.options = { query: true, filter: true, pagination: true };
        _this.accessor.performReset();
        expect(paginationAccessor.resetState).toHaveBeenCalled();
    });
});
//# sourceMappingURL=ResetSearchAccessorSpec.js.map