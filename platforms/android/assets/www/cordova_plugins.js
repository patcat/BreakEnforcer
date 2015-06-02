cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/com.bluecats.beacons/blueCatsSDKCDVPlugin.js",
        "id": "com.bluecats.beacons.BlueCatsSDKCDVPlugin",
        "clobbers": [
            "com.bluecats.beacons"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "com.bluecats.beacons": "1.0.2",
    "org.apache.cordova.android-support-library": "0.0.1"
}
// BOTTOM OF METADATA
});