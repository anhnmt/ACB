"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
exports.generateDeviceId = generateDeviceId;
const crypto_1 = require("crypto");
function generateUUID() {
    const buffer = (0, crypto_1.randomBytes)(16);
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    return [
        buffer.toString('hex', 0, 4),
        buffer.toString('hex', 4, 6),
        buffer.toString('hex', 6, 8),
        buffer.toString('hex', 8, 10),
        buffer.toString('hex', 10, 16)
    ].join('-');
}
function generateDeviceId() {
    const buffer = (0, crypto_1.randomBytes)(16);
    const deviceId = [
        buffer.toString('hex', 0, 4),
        buffer.toString('hex', 4, 6),
        buffer.toString('hex', 6, 8),
        buffer.toString('hex', 8, 10),
        buffer.toString('hex', 10, 16)
    ].join('-');
    return deviceId.toUpperCase();
}
