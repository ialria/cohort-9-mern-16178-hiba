import { ZxcvbnFactory } from "@zxcvbn-ts/core";
let checker = null;
let checkerPromise = null;
async function loadChecker() {
  if (checker) {
    return checker;
  }
  if (!checkerPromise) {
    checkerPromise = Promise.all([
      import("@zxcvbn-ts/language-common"),
      import("@zxcvbn-ts/language-en"),
    ]).then(([common, english]) => {
      checker = new ZxcvbnFactory({
        translations: english.translations,
        graphs: common.adjacencyGraphs,
        dictionary: {
          ...common.dictionary,
          ...english.dictionary,
        },
      });
      return checker;
    });
  }
  return checkerPromise;
}
export default loadChecker;