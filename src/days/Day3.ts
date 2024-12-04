import { FileSystem } from "@effect/platform"
import { Effect } from "effect"

export const day3 = Effect.gen(function*() {
  yield* Effect.log("Day 3")
  const fs = yield* FileSystem.FileSystem
  const input = yield* fs.readFileString("puzzle-input/day3")

  const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/gm
  const matches = input.match(regex)
  let sum = 0
  if (matches) {
    for (const match of matches) {
      const [a, b] = match.slice(4, -1).split(",").map(Number)
      const result = a * b
      sum += result
    }
    yield* Effect.log(`Result of Puzzle 1: ${sum}`)
  }

  const regex2 = /mul\([0-9]{1,3},[0-9]{1,3}\)|do\(\)|don't\(\)/gm
  const matches2 = input.match(regex2)
  let sum2 = 0
  if (matches2) {
    let enabled = true
    for (const match of matches2) {
      if (match === "do()") {
        enabled = true
      } else if (match === "don't()") {
        enabled = false
      } else {
        if (!enabled) {
          continue
        }
        const [a, b] = match.slice(4, -1).split(",").map(Number)
        const result = a * b
        sum2 += result
      }
    }
    yield* Effect.log(`Result of Puzzle 2: ${sum2}`)
  }
})
