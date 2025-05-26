module.exports = function(RED) {
    function PuterMkdirNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.auth = RED.nodes.getNode(config.auth);
        this.remotePath = config.remotePath; // Default remote path from config

        const { execa } = require('execa');

        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"creating..."});

            try {
                // Determine the remote path: use msg.payload if provided, otherwise use node's configured remotePath.
                // Default to '/' if neither is set, though mkdir usually requires a specific path.
                const remotePath = msg.payload || node.remotePath;

                if (!remotePath) {
                    throw new Error("No remote path specified for mkdir");
                }

                // Ensure PUTER_TOKEN is available from the auth node
                if (!node.auth || !node.auth.credentials || !node.auth.credentials.apiToken) {
                    throw new Error("Puter authentication token not available. Configure Puter Auth node.");
                }
                const env = {
                    ...process.env,
                    PUTER_TOKEN: node.auth.credentials.apiToken
                };

                // Execute Puter CLI mkdir command
                const result = await execa('puter', ['mkdir', remotePath], { env });

                msg.payload = {
                    success: true,
                    command: 'mkdir',
                    remotePath: remotePath,
                    stdout: result.stdout,
                    stderr: result.stderr
                };

                node.status({fill:"green", shape:"dot", text:`created ${remotePath}`});
                node.send(msg);

            } catch (error) {
                // If execa fails or any other error occurs
                node.error(error.message, msg);
                msg.payload = {
                    success: false,
                    error: error.message,
                    command: 'mkdir',
                    remotePath: msg.payload || node.remotePath // report the path attempted
                };
                node.status({fill:"red", shape:"ring", text:"failed"});
                node.send(msg);
            }
        });

        node.on('close', function() {
            node.status({});
        });
    }

    RED.nodes.registerType("puter-mkdir", PuterMkdirNode, {
        defaults: {
            name: {value: ""},
            auth: {type: "puter-auth", required: true},
            remotePath: {value: ""} // Removed validator for broader path compatibility initially
        }
    });
};
