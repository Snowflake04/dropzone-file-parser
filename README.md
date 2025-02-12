# Dropzone File Parser

[![npm version](https://badge.fury.io/js/dropzone-file-parser.svg)](https://badge.fury.io/js/dropzone-file-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight utility package for parsing and managing file uploads in drop zones. Simplifies handling complex file uploads, directory traversal, and file system organization using the HTML5 File System API.

## Installation

```bash
npm install dropzone-file-parser
```

## Features

- 🎯 Designed for drop zone implementations
- 🌲 Hierarchical file system structure
- 📁 Supports files and directories
- 📊 Automatic size and file tracking
- 🔄 Asynchronous processing
- 💪 TypeScript support
- ⚡ Lightweight (~2KB gzipped)

## Usage

```javascript
import { constructDirectoryNodeList } from 'dropzone-file-parser';

// Basic dropzone setup
const dropZone = document.querySelector('#dropZone');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropZone.addEventListener('drop', async (event) => {
  const items = event.dataTransfer.items;
  const tree = await constructDirectoryNodeList(items, 'dropped-files');
  
  // Get all files
  const files = tree.getFiles();
  console.log(`Processed ${tree.fileCount} files`);
  
  // Access file data
  files.forEach(node => {
    console.log(`File: ${node.name}, Size: ${node.size} bytes`);
  });
});
```

## API Reference

### constructDirectoryNodeList(items, rootId)
Creates a directory tree from dropped files.

- `items`: FileList or DataTransferItemList
- `rootId`: String identifier for root directory
- Returns: Promise<DirectoryTree>

### DirectoryNode Properties
- `name`: File/directory name
- `isFile`: Boolean
- `id`: Unique identifier
- `parent`: Parent node reference
- `size`: Size in bytes
- `children`: Child nodes (directories only)
- `fileCount`: Number of files in branch
- `file`: File object (files only)

### DirectoryTree Properties
- `root`: Root node
- `fileCount`: Total files
- `getFiles()`: Returns all files

## Error Handling

```javascript
try {
  const tree = await constructDirectoryNodeList(items, 'root');
} catch (error) {
  if (error.name === 'SecurityError') {
    console.error('Permission denied');
  } else if (error.name === 'NotFoundError') {
    console.error('File not found');
  } else {
    console.error('Error:', error);
  }
}
```

## React Example

```jsx
import React from 'react';
import { constructDirectoryNodeList } from 'dropzone-file-parser';

function DropZone() {
  const handleDrop = async (event) => {
    event.preventDefault();
    const items = event.dataTransfer.items;
    const tree = await constructDirectoryNodeList(items, 'react-files');
    const files = tree.getFiles();
    console.log(`Processed ${files.length} files`);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      Drop files here
    </div>
  );
}

export default DropZone;
```

## Browser Support
- Chrome 50+
- Firefox 50+
- Safari 11.1+
- Edge 79+
- Mobile browsers (iOS Safari 11.1+, Android Chrome 50+)

## License

MIT

## Support

Issues: [GitHub Issues](https://github.com/snowflake04/dropzone-file-parser/issues)
