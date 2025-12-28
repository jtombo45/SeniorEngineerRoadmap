let degreesC = 10

export function getTemp(min = -30, max = 50) {
  const change = Math.random() < 0.5 ? -1 : 1
  degreesC += change

  // Clamp the value within min and max
  degreesC = Math.max(min, Math.min(max, degreesC))

  return degreesC
}