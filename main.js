"use strict";

import puzzlePieces from "./dataPazzle.js";

// ця змінна для прикладу
const fragments = ["608017", "248460", "962282", "994725", "177092"];

// функція canConnectForward повертає true чи false якщо ланцюжок
// дозволяє конектити цифри приклад лянцюжка
// const fragments = ["2484(60)", "(60)80(17)", "962282", "994725", "(17)7092"]
// тобто якщо є пряма можливість для з'єднання
// остання пара символів з першого елемента === першій парі символів з наступного елемента
function canConnectForward(first, second) {
  return first.slice(-2) === second.slice(0, 2);
}

// функція canConnectBackward повертає true чи false якщо ланцюжок
// дозволяє конектити цифри приклад лянцюжка
// const fragments = ["(60)8017", "2484(60)", "962282", "994725", "177092"];
// тобто якщо немає прмої можливості для з'єднання і елементи потрібно переставити
// перша пара символів з першого елемента === останній парі символів з наступного елемента
function canConnectBackward(first, second) {
  return first.slice(0, 2) === second.slice(-2);
}

// функція findForwardChain знаходить найдовший ланцюг фрагментів, з’єднаних у прямому порядку
// рекурсивна функція dfs (Depth-First Search) використовується для розширення
// поточного ланцюга, тобто дивиться чи був фрагмент у ланцюгу використаний
//
function findForwardChain(pieces) {
  let longestChain = "";

  function dfs(chain, used) {
    // extended це прапор для перевірки чи вдалося розширити ланцюг,
    // якщо буде знайдений новий фрагмент.
    let extended = false;
    console.log(`Current chain: ${chain}, Used pieces: ${Array.from(used).join(", ")}`);
    for (const piece of pieces) {
      // якщо фрагмент ще не використано і якщо є можливість приєднати
      // цей фрагмент до поточного ланцюга
      if (!used.has(piece) && canConnectForward(chain, piece)) {
        // додати фрагмент до використаних
        used.add(piece);
        // рекурсивно використовуємо функцію dfs для арямого з'єднання
        // та приєднуємо залишок фрагмента до поточного ланцюга
        // тобто це означає що перщі дві цифри були використані дя поєднання
        // і тепер поєднання продовжується з рештою цифр
        const newChain = dfs(chain + piece.slice(2), used);
        console.log(`Extended chain: ${newChain}`);
        // пісдя того як ми повертаємось з рекурсії
        // ми видаляємо фрагмент із used для того щоб
        // ми могли використовувати його для польшого об'єднання в ланцюгу
        // з рештою символів

        used.delete(piece);
        if (newChain.length > chain.length) {
          chain = newChain;
        }
        extended = true;
      }
    }
    return chain;
  }

  // основною метою цього циклу - перебрати всі можливі фрагменти pieces
  // розпочати ланцюг з кожного фрагмента по черзі для перевірки
  // поєднання поточного piece з усіма іншими фрагментами
  // які можуть бути приєднані до нього
  for (const piece of pieces) {
    // used - початковий фрагмент
    // відстежуємо фрагменти які вже були використані для
    // запобігання повторного використання
    const used = new Set([piece]);
    // для кожого piece  функція dfs викликається з фрагментом used
    // і запускається процес формування ланцюга для знаходження всіх
    // можливих зв'язкві з фрагментами
    const chain = dfs(piece, used);
    if (chain.length > longestChain.length) {
      longestChain = chain;
    }
  }

  // якщо ланцюг отриманий від dfs є довший ніж вже знайдений
  // longestChain оновлюється
  // що дозволяє нам в кінцевому випадку знаходити найбільний
  // ланцюг за всіма початковими фрагментами
  // console.log(longestChain)
  return longestChain;
}

// функція findBackwardChain працює схожим чином з функцією findForwardChain
// різниця тільки у функції dfs у змінніій newChain
// з'єднання фрагментів відбувається при тому що
// що перші дві цифри одного фрагмента === останнім двом цифрам наступного фрагмента
function findBackwardChain(pieces) {
  let longestChain = "";

  function dfsBackward(chain, used) {
    let extended = false;
    console.log(`Current backward chain: ${chain}, Used pieces: ${Array.from(used).join(", ")}`);
    for (const piece of pieces) {
      if (!used.has(piece) && canConnectBackward(chain, piece)) {
        used.add(piece);
        const newChain = dfsBackward(
          piece.slice(0, piece.length - 2) + chain,
          used
        );
        console.log(`Extended backward chain: ${newChain}`);
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

// функція findLongestPuzzleChain повертає найдовший
// з двох ланцюгів
function findLongestPuzzleChain(pieces) {
  const forwardChain = findForwardChain(pieces);
  const backwardChain = findBackwardChain(pieces);
  console.log(forwardChain);
  console.log(backwardChain);

  return forwardChain.length > backwardChain.length
    ? forwardChain
    : backwardChain;
}
findLongestPuzzleChain(puzzlePieces);
// console.log(findLongestPuzzleChain(fragments));
