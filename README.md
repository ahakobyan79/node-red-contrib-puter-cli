# node-red-contrib-puter-cli

A Node-RED package that integrates with the Puter CLI to interact with the Puter cloud platform.

## Description

This package provides Node-RED nodes to interact with the Puter cloud platform using the Puter CLI. It allows you to:

- Upload files to Puter cloud storage
- Download files from Puter cloud storage
- List files and directories in Puter cloud storage
- Delete files and directories from Puter cloud storage

## Prerequisites

- [Node-RED](https://nodered.org/) installed
- [Puter CLI](https://github.com/HeyPuter/puter-cli) installed globally: `npm install -g @puter/cli`
- A Puter account and API token (obtained via `puter login`)

## Installation

Install from the Node-RED Palette Manager, or run the following command in your Node-RED user directory:

```bash
npm install node-red-contrib-puter-cli
```

## Usage

### Authentication

1. Add a "puter-auth" configuration node to your flow
2. Enter your Puter API token (obtain it by running `puter login` in your terminal)

### Upload Files

1. Add a "puter-upload" node to your flow
2. Configure the node with your Puter authentication
3. Set the local path of the file or directory to upload
4. Set the remote path where the file should be stored in Puter

You can also provide the local path in `msg.payload` and the remote path in `msg.remotePath`.

### Download Files

1. Add a "puter-download" node to your flow
2. Configure the node with your Puter authentication
3. Set the remote path of the file or directory to download
4. Set the local path where the file should be saved

You can also provide the remote path in `msg.payload` and the local path in `msg.localPath`.

### List Files

1. Add a "puter-list" node to your flow
2. Configure the node with your Puter authentication
3. Set the remote path to list

You can also provide the remote path in `msg.payload`.

### Delete Files

1. Add a "puter-delete" node to your flow
2. Configure the node with your Puter authentication
3. Set the remote path of the file or directory to delete

You can also provide the remote path in `msg.payload`.

## Example Flow

```json
[
    {
        "id": "f6f2187d.f17ca8",
        "type": "puter-upload",
        "z": "2b9467e2.2165e8",
        "name": "",
        "auth": "3fa97b10.3a9954",
        "localPath": "/path/to/local/file.txt",
        "remotePath": "/",
        "x": 340,
        "y": 120,
        "wires": [
            [
                "c6f34603.94d468"
            ]
        ]
    },
    {
        "id": "3fa97b10.3a9954",
        "type": "puter-auth",
        "z": "",
        "name": "My Puter Account"
    },
    {
        "id": "c6f34603.94d468",
        "type": "debug",
        "z": "2b9467e2.2165e8",
        "name": "Upload Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "x": 530,
        "y": 120,
        "wires": []
    }
]
```

## License

MIT
