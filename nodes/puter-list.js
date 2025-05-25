module.exports = function(RED) {
    function PuterListNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.auth = RED.nodes.getNode(config.auth);
        this.remotePath = config.remotePath;
        
        const { execa } = require('execa');
        
        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"listing..."});
            
            try {
                // Get remote path from msg.payload or config
                const remotePath = msg.payload || node.remotePath || '/';
                
                // Set environment variable for Puter CLI authentication
                const env = {
                    ...process.env,
                    PUTER_TOKEN: node.auth.credentials.apiToken
                };
                
                // Execute Puter CLI list command
                const result = await execa('puter', ['ls', remotePath, '--json'], { env });
                
                // Parse the JSON output
                let files = [];
                try {
                    files = JSON.parse(result.stdout);
                } catch (e) {
                    node.warn("Failed to parse JSON output from Puter CLI");
                }
                
                msg.payload = {
                    success: true,
                    command: 'list',
                    remotePath: remotePath,
                    files: files,
                    stdout: result.stdout,
                    stderr: result.stderr
                };
                
                node.status({fill:"green", shape:"dot", text:`listed ${files.length} items`});
                node.send(msg);
            } catch (error) {
                node.error(error.message, msg);
                msg.payload = {
                    success: false,
                    error: error.message,
                    command: 'list'
                };
                node.status({fill:"red", shape:"ring", text:"failed"});
                node.send(msg);
            }
        });
        
        node.on('close', function() {
            node.status({});
        });
    }
    
    RED.nodes.registerType("puter-list", PuterListNode, {
        defaults: {
            name: {value: ""},
            auth: {type: "puter-auth", required: true},
            remotePath: {value: "/"}
        }
    });
}
