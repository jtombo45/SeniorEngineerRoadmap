export async function sortObjectKeysRecursively(unorderedObject) {
  if (typeof unorderedObject !== 'object' || unorderedObject === null || Array.isArray(unorderedObject)) {
    // Return primitives or arrays as is (arrays maintain index order)
    return unorderedObject;
  }

  const orderedObject = {};
  // Get all keys, sort them, and iterate to build a new object
  Object.keys(unorderedObject)
    .sort()
    .forEach((key) => {
      // Recursively sort nested objects
      orderedObject[key] = sortObjectKeysRecursively(unorderedObject[key]);
    });

  return orderedObject;
}
