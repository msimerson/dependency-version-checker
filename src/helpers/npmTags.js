const minions = require("./minions");
const ansiRegex = require("ansi-regex")();

module.exports = {
    get: getNpmTags
};

function getNpmTags(dependency, logger) {
    const command = `npm view ${dependency.name} versions --json`;

    return minions.spawn(command, logger).then(result => {
        let strippedColors = result.replace(ansiRegex, "").replace(/'/g, '"');
        // workaround for bug npm/cli#3611
        if (!/\[/.test(strippedColors)) strippedColors = `[ ${strippedColors.trim()} ]`

        try {
            return JSON.parse(strippedColors);
        } catch (e) {
            throw new Error("Could not parse as JSON: " + strippedColors);
        }
    });
}
