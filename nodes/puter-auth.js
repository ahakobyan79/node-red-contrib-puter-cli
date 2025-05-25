module.exports = function(RED) {
    function PuterAuthNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.apiToken = config.apiToken;
    }

    RED.nodes.registerType("puter-auth", PuterAuthNode, {
        credentials: {
            apiToken: {type: "password"}
        }
    });
}
