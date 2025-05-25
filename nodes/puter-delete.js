module.exports = function(RED) {
    function PuterDeleteNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.auth = RED.nodes.getNode(config.auth);
        this.remotePath = config.remotePath;
        
        const { execa } = require('execa');
        
        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"deleting..."});
            
            try {
                // Get remote path from msg.payload or config
                const remotePath = msg.payload || node.remotePath;
                if (!remotePath) {
                    throw new Error("No remote path specified");
                }
                
                // Set environment variable for Puter CLI authentication
                const env = {
                    ...process.env,
                    PUTER_TOKEN: node.auth.credentials.apiToken
                };
                
                // Execute Puter CLI delete command
                const result = await execa('puter', ['rm', remotePath, '--force'], { env });
                
                msg.payload = {
                    success: true,
                    command: 'delete',
                    remotePath: remotePath,
                    stdout: result.stdout,
                    stderr: result.stderr
                };
                
                node.status({fill:"green", shape:"dot", text:"deleted"});
                node.send(msg);
            } catch (error) {
                node.error(error.message, msg);
                msg.payload = {
                    success: false,
                    error: error.message,
                    command: 'delete'
                };
                node.status({fill:"red", shape:"ring", text:"failed"});
                node.send(msg);
            }
        });
        
        node.on('close', function() {
            node.status({});
        });
    }
    
    RED.nodes.registerType("puter-delete", PuterDeleteNode, {
        defaults: {
            name: {value: ""},
            auth: {type: "puter-auth", required: true},
            remotePath: {value: ""}
        }
    });
}
