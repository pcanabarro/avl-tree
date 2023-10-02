const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class AVL {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class TreeAVL {
  insert(root, key) {
    if (!root) {
      return new AVL(key);
    }

    if (key < root.key) {
      root.left = this.insert(root.left, key);
    } else {
      root.right = this.insert(root.right, key);
    }

    root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

    return this.balance(root);
  }

  delete(root, key) {
    if (!root) {
      return root;
    }

    if (key < root.key) {
      root.left = this.delete(root.left, key);
    } else if (key > root.key) {
      root.right = this.delete(root.right, key);
    } else {
      if (!root.left) {
        const temp = root.right;
        root = null;
        return temp;
      } else if (!root.right) {
        const temp = root.left;
        root = null;
        return temp;
      }

      const temp = this.getMinValueNode(root.right);
      root.key = temp.key;
      root.right = this.delete(root.right, temp.key);
    }

    root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

    return this.balance(root);
  }

  search(root, key) {
    if (!root) {
      return false;
    }

    if (key === root.key) {
      return true;
    } else if (key < root.key) {
      return this.search(root.left, key);
    } else {
      return this.search(root.right, key);
    }
  }

  getHeight(root) {
    if (!root) {
      return 0;
    }
    return root.height;
  }

  balance(root) {
    const balance = this.getBalance(root);

    if (balance > 1) {
      if (this.getBalance(root.left) < 0) {
        root.left = this.leftRotate(root.left);
      }
      return this.rightRotate(root);
    }

    if (balance < -1) {
      if (this.getBalance(root.right) > 0) {
        root.right = this.rightRotate(root.right);
      }
      return this.leftRotate(root);
    }

    return root;
  }

  getBalance(root) {
    if (!root) {
      return 0;
    }
    return this.getHeight(root.left) - this.getHeight(root.right);
  }

  leftRotate(z) {
    const y = z.right;
    const T2 = y.left;

    y.left = z;
    z.right = T2;

    z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    return x;
  }

  getMinValueNode(root) {
    if (!root || !root.left) {
      return root;
    }
    return this.getMinValueNode(root.left);
  }
}

function printTree(root) {
  if (root) {
    printTree(root.left);
    console.log(root.key, end=" ");
    printTree(root.right);
  }
}

function menu() {
  const tree = new TreeAVL();
  let root = null;

  rl.setPrompt("\nMenu:\n1. Insert value\n2. Search value\n3. Delete value\n4. Print tree in order\n5. Exit\nChoose an option: ");
  rl.prompt();

  rl.on('line', (choice) => {
    if (choice === "1") {
      rl.question("Enter the value to insert: ", (value) => {
        value = parseInt(value);
        root = tree.insert(root, value);
        console.log(`${value} inserted successfully.`);
        rl.prompt();
      });
    } else if (choice === "2") {
      rl.question("Enter the value to search: ", (value) => {
        value = parseInt(value);
        if (tree.search(root, value)) {
          console.log(`${value} found in the tree.`);
        } else {
          console.log(`${value} not found in the tree.`);
        }
        rl.prompt();
      });
    } else if (choice === "3") {
      rl.question("Enter the value to delete: ", (value) => {
        value = parseInt(value);
        if (tree.search(root, value)) {
          root = tree.delete(root, value);
          console.log(`${value} removed successfully.`);
        } else {
          console.log(`${value} not found in the tree.`);
        }
        rl.prompt();
      });
    } else if (choice === "4") {
      console.log("Tree in order:", end=" ");
      printTree(root);
      console.log();
      rl.prompt();
    } else if (choice === "5") {
      console.log("Exiting the program.");
      rl.close();
    } else {
      console.log("Invalid option. Please try again.");
      rl.prompt();
    }
  });
}

menu();