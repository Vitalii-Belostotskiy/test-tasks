"use strict";

import puzzlePieces from "./dataPazzle.js";

const fragments = ["608017", "248460", "962282", "994725", "177092"];

function canConnectForward(first, second) {
  return first.slice(-2) === second.slice(0, 2);
}

function canConnectBackward(first, second) {
  return first.slice(0, 2) === second.slice(-2);
}

function findForwardChain(pieces) {
  let longestChain = "";
  
  function dfs(chain, used) {
      let extended = false;
      for (const piece of pieces) {
          if (!used.has(piece) && canConnectForward(chain, piece)) {
              used.add(piece);
              const newChain = dfs(chain + piece.slice(2), used);
              used.delete(piece);
              if (newChain.length > chain.length) {
                  chain = newChain;
              }
              extended = true;
          }
      }
      return extended ? chain : chain;
  }

  for (const piece of pieces) {
      const used = new Set([piece]);
      const chain = dfs(piece, used);
      if (chain.length > longestChain.length) {
          longestChain = chain;
      }
  }

  return longestChain;
}

function findBackwardChain(pieces) {
  let longestChain = "";
  
  function dfs(chain, used) {
      let extended = false;
      for (const piece of pieces) {
          if (!used.has(piece) && canConnectBackward(chain, piece)) {
              used.add(piece);
              const newChain = dfs(piece.slice(0, piece.length - 2) + chain, used);
              used.delete(piece);
              if (newChain.length > chain.length) {
                  chain = newChain;
              }
              extended = true;
          }
      }
      return extended ? chain : chain;
  }

  for (const piece of pieces) {
      const used = new Set([piece]);
      const chain = dfs(piece, used);
      if (chain.length > longestChain.length) {
          longestChain = chain;
      }
  }

  return longestChain;
}

function findLongestPuzzleChain(pieces) {
  const forwardChain = findForwardChain(pieces);
  const backwardChain = findBackwardChain(pieces);
  
  return forwardChain.length > backwardChain.length ? forwardChain : backwardChain;
}

console.log(findLongestPuzzleChain(puzzlePieces));
