Object.defineProperty(exports, "__esModule", { value: true });
var ReactTestUtils = require("react-dom/test-utils");
var js_beautify_1 = require("js-beautify");
var server_1 = require("react-dom/server");
var ReactDOM = require("react-dom");
var compact = require("lodash/compact");
var map = require("lodash/map");
exports.hasClass = function (inst, className) {
    if (ReactTestUtils.isDOMComponent(inst.node)) {
        return inst.hasClass(className);
    }
    else {
        try {
            var classes = ReactDOM.findDOMNode(inst.node).className;
            return (' ' + classes + ' ').indexOf(' ' + className + ' ') > -1;
        }
        catch (e) { }
    }
    return false;
};
function jsxToHTML(Element) {
    return server_1.renderToStaticMarkup(Element)
        .replace(/<input([^>]*)\/>/g, "<input$1>");
}
exports.jsxToHTML = jsxToHTML;
function htmlClean(html) {
    return html
        .replace(/<!-- react-text: \d+ -->/g, '')
        .replace(/<!-- \/react-text -->/g, '')
        .replace(/<!-- react-empty: \d+ -->/g, '');
}
exports.htmlClean = htmlClean;
exports.prettyHtml = function (html) {
    return js_beautify_1.html(html, { "indent_size": 2 });
};
exports.expectWrapperSnaphot = function (ctx) {
    expect(exports.prettyHtml(ctx.wrapper.html())).toMatchSnapshot();
};
exports.printPrettyHtml = function (html) {
    html = exports.prettyHtml(html).replace(/class=/g, "className=")
        .replace(/<input([^>]*)>/g, "<input$1/>")
        .replace(/readonly=""/g, "readOnly={true}")
        .replace(/font-size/g, "fontSize")
        .replace(/style="([^"]+)"+/g, function (_match, style) {
        var reactStyle = map(compact(style.split(";")), function (keyvalue) {
            var _a = keyvalue.split(":"), key = _a[0], value = _a[1];
            return key + ":\"" + value + "\"";
        }).join(",");
        return "style={{" + reactStyle + "}}";
    });
    console.log("\n" + html);
};
exports.fastClick = function (el) {
    el.simulate("click");
};
//# sourceMappingURL=TestHelpers.js.map