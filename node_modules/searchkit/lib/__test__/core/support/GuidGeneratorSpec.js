Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../");
describe("GuidGenerator", function () {
    it("guid()", function () {
        var gen = new _1.GuidGenerator();
        expect(gen.guid()).toEqual("1");
        expect(gen.guid("foo")).toEqual("foo2");
        gen.reset();
        expect(gen.guid("foo")).toEqual("foo1");
    });
});
//# sourceMappingURL=GuidGeneratorSpec.js.map