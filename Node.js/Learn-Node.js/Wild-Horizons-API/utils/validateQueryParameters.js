export const validateQueryParameters = (queryObj) => {

    const allowedFilters = [
    "name",
    "location",
    "country",
    "continent",
    "is_open_to_public",
    "uuid",
    "fun_fact",
    "description"
  ]

  for (const key of Object.keys(queryObj)) {
    if (!allowedFilters.includes(key)) {
        return key // return the invalid key
    }
  }

  return null // everything OK
}