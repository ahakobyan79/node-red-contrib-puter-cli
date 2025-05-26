module.exports = function(RED) {
    function PuterMvNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.auth = RED.nodes.getNode(config.auth);
        this.sourcePath = config.sourcePath;
        this.destinationPath = config.destinationPath;

        const { execa } = require('execa');

        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"moving..."});

            try {
                // Determine sourcePath: msg.payload.sourcePath, then msg.sourcePath, then config
                let sourcePath = node.sourcePath; // Default to config
                if (msg.payload && typeof msg.payload === 'object' && msg.payload.sourcePath) {
                    sourcePath = msg.payload.sourcePath;
                } else if (msg.sourcePath) {
                    sourcePath = msg.sourcePath;
                } else if (typeof msg.payload === 'string' && !node.sourcePath) { 
                    // If payload is a string and sourcePath is not configured, assume payload is sourcePath
                    // This provides some flexibility but might need to be documented clearly or refined
                    sourcePath = msg.payload;
                }


                // Determine destinationPath: msg.payload.destinationPath, then msg.destinationPath, then config
                let destinationPath = node.destinationPath; // Default to config
                if (msg.payload && typeof msg.payload === 'object' && msg.payload.destinationPath) {
                    destinationPath = msg.payload.destinationPath;
                } else if (msg.destinationPath) {
                    destinationPath = msg.destinationPath;
                }

                if (!sourcePath) {
                    throw new Error("Source path not specified for mv operation");
                }
                if (!destinationPath) {
                    throw new Error("Destination path not specified for mv operation");
                }

                if (!node.auth || !node.auth.credentials || !node.auth.credentials.apiToken) {
                    throw new Error("Puter authentication token not available. Configure Puter Auth node.");
                }
                const env = {
                    ...process.env,
                    PUTER_TOKEN: node.auth.credentials.apiToken
                };

                // Execute Puter CLI mv command
                const result = await execa('puter', ['mv', sourcePath, destinationPath], { env });

                msg.payload = {
                    success: true,
                    command: 'mv',
                    sourcePath: sourcePath,
                    destinationPath: destinationPath,
                    stdout: result.stdout,
                    stderr: result.stderr
                };

                node.status({fill:"green", shape:"dot", text:`moved ${sourcePath} to ${destinationPath}`});
                node.send(msg);

            } catch (error) {
                node.error(error.message, msg);
                const attemptedSource = (msg.payload && typeof msg.payload === 'object' && msg.payload.sourcePath) || msg.sourcePath || node.sourcePath || (typeof msg.payload === 'string' ? msg.payload : undefined);
                const attemptedDest = (msg.payload && typeof msg.payload === 'object' && msg.payload.destinationPath) || msg.destinationPath || node.destinationPath;
                
                msg.payload = {
                    success: false,
                    error: error.message,
                    command: 'mv',
                    sourcePath: attemptedSource,
                    destinationPath: attemptedDest
                };
                node.status({fill:"red", shape:"ring", text:"failed"});
                node.send(msg);
            }
        });

        node.on('close', function() {
            node.status({});
        });
    }

    RED.nodes.registerType("puter-mv", PuterMvNode, {
        defaults: {
            name: {value: ""},
            auth: {type: "puter-auth", required: true},
            sourcePath: {value: "", required: false}, // Not strictly required if passed via msg
            destinationPath: {value: "", required: false} // Not strictly required if passed via msg
        }
    });
};
