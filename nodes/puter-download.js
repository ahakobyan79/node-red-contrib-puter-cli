module.exports = function(RED) {
    function PuterDownloadNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.auth = RED.nodes.getNode(config.auth);
        this.remotePath = config.remotePath;
        this.localPath = config.localPath;
        
        const { execa } = require('execa');
        
        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"downloading..."});
            
            try {
                // Get remote path from msg.payload or config
                const remotePath = msg.payload || node.remotePath;
                if (!remotePath) {
                    throw new Error("No remote file path specified");
                }
                
                // Get local path from msg.localPath or config
                const localPath = msg.localPath || node.localPath || '.';
                
                // Set environment variable for Puter CLI authentication
                const env = {
                    ...process.env,
                    PUTER_TOKEN: node.auth.credentials.apiToken
                };
                
                // Execute Puter CLI copy command (cp <remote_src> <local_dest>)
                const result = await execa('puter', ['cp', remotePath, localPath], { env });
                
                msg.payload = {
                    success: true,
                    command: 'cp', // Changed from 'download' to 'cp'
                    remotePath: remotePath,
                    localPath: localPath,
                    stdout: result.stdout,
                    stderr: result.stderr
                };
                
                node.status({fill:"green", shape:"dot", text:"downloaded"});
                node.send(msg);
            } catch (error) {
                node.error(error.message, msg);
                msg.payload = {
                    success: false,
                    error: error.message,
                    command: 'cp' // Changed from 'download' to 'cp'
                };
                node.status({fill:"red", shape:"ring", text:"failed"});
                node.send(msg);
            }
        });
        
        node.on('close', function() {
            node.status({});
        });
    }
    
    RED.nodes.registerType("puter-download", PuterDownloadNode, {
        defaults: {
            name: {value: ""},
            auth: {type: "puter-auth", required: true},
            remotePath: {value: ""},
            localPath: {value: ""}
        }
    });
}
