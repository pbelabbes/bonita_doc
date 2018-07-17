Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../");
describe("block", function () {
    it("block test", function () {
        var b = _1.block("foo");
        // console.log(typeof b)
        // console.log(b.toString())
        // console.log(b.mix("bar").state({hover:true}).toString())
        var bemBlocks = {
            item: _1.block("item"),
            container: _1.block("container")
        };
        expect(bemBlocks.container.el("panel").mix("red").state({ active: true }).toString())
            .toEqual("container__panel red is-active");
        expect(bemBlocks.container.el("panel").mix(bemBlocks.item.el().mod({ mod: "yes" })).state({ active: true }).toString())
            .toEqual("container__panel item item_mod_yes is-active");
        expect(bemBlocks.container.mod({ type: "text" }).mix("red").state({ active: true }).toString())
            .toEqual("container container_type_text red is-active");
        expect(_1.block("button").el("icon").mod({ name: "check" }).toString())
            .toEqual("button__icon button__icon_name_check");
        expect(_1.block("button").el().mod({ name: "check" }).toString())
            .toEqual("button button_name_check");
        expect(_1.block("button").el().mix(["foo", "bar"]).toString())
            .toEqual("button foo bar");
    });
});
//# sourceMappingURL=blockSpec.js.map