// Function to apply dynamic filters based on query parameters using exact and partial matches
export const applyFilters =  (list, queryObj) => {
    
  return list.filter(dest => {
    // Check each query parameter against the destination fields using key-value pairs
    return Object.entries(queryObj).every(([queryKey, queryValue]) => {
      // Handle nested details fields
      if (queryKey === "fun_fact" || queryKey === "description") {
        return dest.details?.some(detail =>
          (detail[queryKey] ?? "")
            .toLowerCase()
            .includes(queryValue.toLowerCase())
        ) ?? false
      }

      const fieldValue = dest[queryKey]

      // Handle top-level field: boolean and string fields
      if (typeof fieldValue === "boolean") {
        return fieldValue === (queryValue === "true")
      }

      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase() === queryValue.toLowerCase()
      }

      return false
    })
  })
}