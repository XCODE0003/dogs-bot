"use strict";
exports.__esModule = true;
exports.encoding = exports.config = exports.environment = void 0;
var fs = require("fs");
exports.environment = process.argv[2];
var configPath = __dirname + "/../../config/config.dev.json";
parseConfig();
exports.encoding = 'utf-8';
function parseConfig() {
    var file = fs.readFileSync(configPath, exports.encoding);
    exports.config = JSON.parse(file);
}
