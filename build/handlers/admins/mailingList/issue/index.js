"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const issueSms_1 = require("../../../../handlers/admins/mailingList/issue/issueSms");
const issueEmail_1 = require("../../../../handlers/admins/mailingList/issue/issueEmail");
exports.composer = new grammy_1.Composer();
exports.composer.use(issueSms_1.composer);
exports.composer.use(issueEmail_1.composer);
