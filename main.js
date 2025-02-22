"use strict";

import puzzlePieces from "./dataPazzle.js";

function canConnectForward(first, second) {
  return first.slice(-2) === second.slice(0, 2);
}

function canConnectBackward(first, second) {
  return first.slice(0, 2) === second.slice(-2);
}

// The findForwardChain function finds the longest chain of fragments connected in order.
// The recursive dfs (Depth-First Search) function is used to extend the current chain,
// checking if a fragment has already been used in the chain.
function findForwardChain(pieces) {
  let longestChain = "";

  function dfs(chain, used) {
    // 'extended' is a flag to check if the chain was successfully extended
    // when a new fragment is found.
    let extended = false;

    for (const piece of pieces) {
      // If the fragment is not yet used and if it can be added
      // to the current chain.
      if (!used.has(piece) && canConnectForward(chain, piece)) {
        // Add the fragment to the used ones.
        used.add(piece);
        // Recursively use the dfs function for the direct connection
        // and attach the remaining fragment to the current chain.
        // This means the first two digits were used for the connection,
        // and now the connection continues with the remaining digits.
        const newChain = dfs(chain + piece.slice(2), used);
        // After returning from recursion,
        // we remove the fragment from used so that
        // we can use it for further merging in the chain
        // with the remaining characters.

        used.delete(piece);
        if (newChain.length > chain.length) {
          chain = newChain;
        }
        extended = true;
      }
    }
    return chain;
  }

  // The main goal of this loop is to iterate through all possible fragments, pieces.
  // Start a chain from each fragment in turn to check
  // the connection of the current piece with all other fragments
  // that can be attached to it.
  for (const piece of pieces) {
    // 'used' - the initial fragment
    // tracking the fragments that have already been used
    // to prevent reuse.
    const used = new Set([piece]);
    // For each piece, the dfs function is called with the used fragment,
    // and the process of forming the chain begins to find all
    // possible connections with the fragments.
    const chain = dfs(piece, used);
    if (chain.length > longestChain.length) {
      longestChain = chain;
    }
  }

  // If the chain obtained from dfs is longer than the already found
  // longestChain, it is updated,
  // allowing us to eventually find the longest
  // chain across all starting fragments.
  return longestChain;
}

// The findBackwardChain function works similarly to the findForwardChain function.
// The only difference is in the dfsBackward function,
// where in the newChain variable,
// the connection of fragments occurs when
// the first two digits of one fragment === the last two digits of the next fragment.
function findBackwardChain(pieces) {
  let longestChain = "";

  function dfsBackward(chain, used) {
    let extended = false;

    for (const piece of pieces) {
      if (!used.has(piece) && canConnectBackward(chain, piece)) {
        used.add(piece);
        const newChain = dfsBackward(
          piece.slice(0, piece.length - 2) + chain,
          used
        );
        used.delete(piece);
        if (newChain.length > chain.length) {
          chain = newChain;
        }
        extended = true;
      }
    }
    return chain;
  }

  for (const piece of pieces) {
    const used = new Set([piece]);
    const chain = dfsBackward(piece, used);
    if (chain.length > longestChain.length) {
      longestChain = chain;
    }
  }

  return longestChain;
}

// The findLongestPuzzleChain function returns the longest
// of the two chains.
function findLongestPuzzleChain(pieces) {
  const forwardChain = findForwardChain(pieces);
  const backwardChain = findBackwardChain(pieces);
  
  return forwardChain.length > backwardChain.length
    ? forwardChain
    : backwardChain;
}

findLongestPuzzleChain(puzzlePieces);

const longestChain = findLongestPuzzleChain(puzzlePieces);
const longestPazzleChain = document.querySelector('.pazzlechain');
longestPazzleChain.innerHTML = `One-row digital puzzle is: ${longestChain}`;