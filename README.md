# node-red-contrib-puter-cli

A Node-RED package that integrates with the Puter CLI to interact with the Puter cloud platform.

## Description

This package provides Node-RED nodes to interact with the Puter cloud platform using the Puter CLI. It allows you to perform various file and directory operations, including:

- Authenticating with your Puter account.
- Uploading files and directories to Puter cloud storage.
- Downloading files and directories from Puter cloud storage.
- Listing files and directories.
- Deleting files and directories.
- Creating new directories.
- Moving or renaming files and directories.

## Prerequisites

- [Node-RED](https://nodered.org/) installed.
- [Puter CLI](https://github.com/HeyPuter/puter-cli) installed globally. This is essential for the nodes to function.
  ```bash
  npm install -g @puter/cli
  ```
- A Puter account. You will need to log in via the Puter CLI at least once (`puter login`) to authorize it for use with your account and to obtain your API token.

## Installation

Install `node-red-contrib-puter-cli` from the Node-RED Palette Manager by searching for its name, or install it manually by running the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-puter-cli
```
Restart Node-RED after installation.

## Nodes

This package includes the following nodes:

### 1. Puter Auth (`puter-auth`)
- **Purpose**: Configuration node to store your Puter API token securely. This node is used by all other `puter-*` nodes to authenticate with the Puter platform.
- **Setup**:
    1. Add a `puter-auth` configuration node (usually done when configuring another Puter node for the first time).
    2. Enter your Puter API token. You can obtain this token by running `puter token show` or `puter token` in your terminal after logging in with `puter login`.

### 2. Puter List (`puter-list`)
- **Purpose**: Lists files and directories at a specified remote path in your Puter storage.
- **CLI Command**: `puter ls <remotePath> --json`
- **Configuration**:
    - `Authentication`: Link to your `puter-auth` configuration node.
    - `Remote Path`: The path in Puter to list (e.g., `/documents`). Defaults to `/`. Can be overridden by `msg.payload`.
- **Output**: `msg.payload.files` will contain an array of file/directory objects.

### 3. Puter Upload (`puter-upload`)
- **Purpose**: Uploads a local file or directory to a specified remote path in Puter.
- **CLI Command**: `puter cp <localPath> <remotePath>`
- **Configuration**:
    - `Authentication`: Link to your `puter-auth` node.
    - `Local Path`: Path to the local file or directory to upload. Can be overridden by `msg.payload` (if string) or `msg.payload.localPath` (if object).
    - `Remote Path`: The destination path in Puter (e.g., `/backups/`). Defaults to `/`. Can be overridden by `msg.remotePath` or `msg.payload.remotePath`.

### 4. Puter Download (`puter-download`)
- **Purpose**: Downloads a file or directory from Puter to a local path.
- **CLI Command**: `puter cp <remotePath> <localPath>`
- **Configuration**:
    - `Authentication`: Link to your `puter-auth` node.
    - `Remote Path`: The path of the file/directory in Puter to download. Can be overridden by `msg.payload` (if string) or `msg.payload.remotePath`.
    - `Local Path`: The local path where the file/directory should be saved. Defaults to `.` (Node-RED's current working directory). Can be overridden by `msg.localPath` or `msg.payload.localPath`.

### 5. Puter Delete (`puter-delete`)
- **Purpose**: Deletes a file or directory from Puter storage.
- **CLI Command**: `puter rm <remotePath> --force` (Note: `--force` is always used to prevent interactive prompts).
- **Configuration**:
    - `Authentication`: Link to your `puter-auth` node.
    - `Remote Path`: The path of the file/directory in Puter to delete. Can be overridden by `msg.payload`.

### 6. Puter Mkdir (`puter-mkdir`)
- **Purpose**: Creates a new directory at a specified remote path in Puter.
- **CLI Command**: `puter mkdir <remotePath>`
- **Configuration**:
    - `Authentication`: Link to your `puter-auth` node.
    - `Remote Path`: The full path of the new directory to create in Puter (e.g., `/my_new_folder`). Can be overridden by `msg.payload`.

### 7. Puter Mv (`puter-mv`)
- **Purpose**: Moves or renames a file or directory within your Puter storage.
- **CLI Command**: `puter mv <sourcePath> <destinationPath>`
- **Configuration**:
    - `Authentication`: Link to your `puter-auth` node.
    - `Source Path`: The current path of the file/directory in Puter to move/rename. Can be overridden by `msg.payload.sourcePath`, `msg.sourcePath`, or `msg.payload` (if string and source path config is empty).
    - `Destination Path`: The new path or name for the file/directory in Puter. Can be overridden by `msg.payload.destinationPath` or `msg.destinationPath`.


## Example Flow

(The example flow demonstrating `puter-upload` can be kept here or expanded if desired. For brevity, it's fine as is for now.)

```json
[
    {
        "id": "f6f2187d.f17ca8",
        "type": "puter-upload",
        "z": "2b9467e2.2165e8",
        "name": "Upload My File",
        "auth": "3fa97b10.3a9954",
        "localPath": "/path/to/your/local/file.txt",
        "remotePath": "/uploads/",
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
