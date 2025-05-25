module.exports = function(RED) {
    function PuterUploadNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.auth = RED.nodes.getNode(config.auth);
        this.remotePath = config.remotePath;
        
        const { execa } = require('execa');
        
        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"uploading..."});
            
            try {
                // Get local file path from msg.payload or config
                const localPath = msg.payload || config.localPath;
                if (!localPath) {
                    throw new Error("No local file path specified");
                }
                
                // Get remote path from msg.remotePath or config
                const remotePath = msg.remotePath || node.remotePath || '/';
                
                // Set environment variable for Puter CLI authentication
                const env = {
                    ...process.env,
                    PUTER_TOKEN: node.auth.credentials.apiToken
                };
                
                // Execute Puter CLI upload command
                const result = await execa('puter', ['upload', localPath, remotePath], { env });
                
                msg.payload = {
                    success: true,
                    command: 'upload',
                    localPath: localPath,
                    remotePath: remotePath,
                    stdout: result.stdout,
                    stderr: result.stderr
                };
                
                node.status({fill:"green", shape:"dot", text:"uploaded"});
                node.send(msg);
            } catch (error) {
                node.error(error.message, msg);
                msg.payload = {
                    success: false,
                    error: error.message,
                    command: 'upload'
                };
                node.status({fill:"red", shape:"ring", text:"failed"});
                node.send(msg);
            }
        });
        
        node.on('close', function() {
            node.status({});
        });
    }
    
    RED.nodes.registerType("puter-upload", PuterUploadNode, {
        defaults: {
            name: {value: ""},
            auth: {type: "puter-auth", required: true},
            localPath: {value: ""},
            remotePath: {value: "/"}
        }
    });
}
