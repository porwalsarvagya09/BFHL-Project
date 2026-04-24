const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function isValidEdge(str) {
  if (!str || typeof str !== "string") return false;
  str = str.trim();
  const regex = /^[A-Z]->[A-Z]$/;
  if (!regex.test(str)) return false;
  const [p, c] = str.split("->");
  if (p === c) return false;
  return true;
}

function buildGraph(edges) {
  const adj = {};
  const parentMap = {};

  edges.forEach((edge) => {
    const [p, c] = edge.split("->");

    if (!adj[p]) adj[p] = [];
    if (!adj[c]) adj[c] = [];

    // multi-parent check
    if (parentMap[c]) return;

    adj[p].push(c);
    parentMap[c] = p;
  });

  return { adj, parentMap };
}

function findRoots(nodes, parentMap) {
  return nodes.filter((n) => !parentMap[n]);
}

function detectCycle(node, adj, visited, stack) {
  if (stack.has(node)) return true;
  if (visited.has(node)) return false;

  visited.add(node);
  stack.add(node);

  for (let nei of adj[node]) {
    if (detectCycle(nei, adj, visited, stack)) return true;
  }

  stack.delete(node);
  return false;
}

function buildTree(node, adj) {
  const res = {};
  for (let child of adj[node]) {
    res[child] = buildTree(child, adj);
  }
  return res;
}

function getDepth(node, adj) {
  if (!adj[node] || adj[node].length === 0) return 1;
  let max = 0;
  for (let child of adj[node]) {
    max = Math.max(max, getDepth(child, adj));
  }
  return max + 1;
}

app.post("/bfhl", (req, res) => {
  const data = req.body.data || [];

  const invalid = [];
  const duplicates = [];
  const seen = new Set();
  const validEdges = [];

  data.forEach((item) => {
    const trimmed = item?.trim();

    if (!isValidEdge(trimmed)) {
      invalid.push(item);
    } else {
      if (seen.has(trimmed)) {
        if (!duplicates.includes(trimmed)) {
          duplicates.push(trimmed);
        }
      } else {
        seen.add(trimmed);
        validEdges.push(trimmed);
      }
    }
  });

  const { adj, parentMap } = buildGraph(validEdges);

  const nodes = Array.from(
    new Set(validEdges.flatMap((e) => e.split("->")))
  );

  let roots = findRoots(nodes, parentMap);

  const visited = new Set();
  const hierarchies = [];

  let totalTrees = 0;
  let totalCycles = 0;
  let maxDepth = 0;
  let largestRoot = "";

  const allNodes = new Set(nodes);

  function processComponent(start) {
    const stack = new Set();
    const hasCycle = detectCycle(start, adj, visited, stack);

    if (hasCycle) {
      totalCycles++;
      hierarchies.push({
        root: start,
        tree: {},
        has_cycle: true,
      });
    } else {
      const tree = {};
      tree[start] = buildTree(start, adj);
      const depth = getDepth(start, adj);

      totalTrees++;

      if (
        depth > maxDepth ||
        (depth === maxDepth && start < largestRoot)
      ) {
        maxDepth = depth;
        largestRoot = start;
      }

      hierarchies.push({
        root: start,
        tree,
        depth,
      });
    }
  }

  // process roots
  roots.forEach((r) => {
    if (!visited.has(r)) processComponent(r);
  });

  // remaining nodes 
  nodes.forEach((n) => {
    if (!visited.has(n)) {
      processComponent(n);
    }
  });

  const response = {
    user_id: "yourname_ddmmyyyy",
    email_id: "your_email",
    college_roll_number: "your_roll",
    hierarchies,
    invalid_entries: invalid,
    duplicate_edges: duplicates,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot,
    },
  };

  res.json(response);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});