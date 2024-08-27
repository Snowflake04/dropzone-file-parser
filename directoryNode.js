/**
 * @fileoverview
 *  A parser for the files and folders that has been dropped in a dropZone or upload zone.
 * This helps to parse all the files as well as transverse through all the folder and list all the contents inside the folders.
 */

class DirectoryNode {
  /**
   * Constructs a new instance of DirectoryNode.
   *
   * @param {Object} entry - An object representing the file or directory. Must contain properties such as `name`, `isFile`, and optionally `id`.
   * @param {?DirectoryNode} parent - The parent node of this node, if any.
   */

  constructor(entry, parent) {
    this.name = entry.name ?? "root";
    this.isFile = entry.isFile ?? false;
    this.id = entry.id ?? "";
    this.parent = parent;
    this.size = 0;
    if (entry.isFile) {
      entry.file((f) => {
        this.file = f;
        this.size = f.size;
        if (this.parent) {
          this.parent.updateSize(f.size);
        }
      });
    } else {
      this.children = [];
      this.fileCount = 0;
    }
  }
  /**
   * Adds a child node to this node.
   *
   * @param {DirectoryNode} node - The child node to add.
   */

  addChild(node) {
    this.children.push(node);
    if (node.isFile) this.updateFileCount();
  }

  /**
   * Updates the size of this node by aggregating the sizes of all its children.
   * Also updates the size of the parent as well
   */
  updateSize(size) {
    this.size = this.size + size;
    if (this.parent) {
      this.parent.updateSize(size);
    }
  }

  /**
   * Updates the fileCount of this node .
   * Also updates the fileCount of the parent as well
   */
  updateFileCount() {
    this.fileCount++;
    if (this.parent) {
      this.parent.updateFileCount();
    }
  }

  /**
   * Retrieves all files within this node and its descendants.
   *
   * @returns {Array<DirectoryNode>} An array of DirectoryNode instances representing files.
   */

  getFiles() {
    if (this.isFile) {
      return [this];
    } else {
      return this.children.reduce((files, child) => files.concat(child.getFiles()), []);
    }
  }
}

/**
 * Manages a list of DirectoryNode instances, providing methods to add entries and process directories.
 */

export default class DirectoryNodeList {
  /**
   * Constructs a new instance of DirectoryNodeList.
   *
   * @param {String} root - The identifier for the root of the directory structure. This is the current node UUID
   */

  constructor(root) {
    this.root = new DirectoryNode({ name: "root", id: root }, null);
    this.fileCount = 0;
  }
  addEntry(entry) {
    const node = new DirectoryNode(entry, this.root);
    this.root.addChild(node);
    return node;
  }

  processEntry(entry) {
    let node = this.addEntry(entry);
    if (entry.isDirectory) {
      return this.parseNestedDirectory(entry, node);
    } else {
      this.fileCount++;
      return Promise.resolve();
    }
  }

  parseNestedDirectory(entry, parentNode) {
    return new Promise((resolve, reject) => {
      const dirReader = entry.createReader();
      dirReader.readEntries((entries) => {
        const promises = entries.map((entry) => {
          parentNode.addChild(new DirectoryNode(entry, parentNode));
          const node = parentNode.children[parentNode.children.length - 1];
          if (entry.isDirectory) {
            return this.parseNestedDirectory(entry, node);
          } else {
            this.fileCount++;
            return Promise.resolve();
          }
        });
        Promise.all(promises)
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  /**
   * Retrieves all files within the managed directory structure.
   *
   * @returns {Array<DirectoryNode>} An array of DirectoryNode instances representing files.
   */

  getFiles() {
    return this.root.getFiles();
  }
}
