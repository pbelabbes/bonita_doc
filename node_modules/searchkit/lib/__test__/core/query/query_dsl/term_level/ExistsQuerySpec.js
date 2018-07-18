Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../../../");
it("RangeQuery", function () {
    expect(_1.ExistsQuery("prices")).toEqual({
        exists: {
            field: "prices"
        }
    });
});
//# sourceMappingURL=ExistsQuerySpec.js.map