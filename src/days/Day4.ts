import { FileSystem } from "@effect/platform"
import { Effect } from "effect"

export const day4 = Effect.gen(function*() {
  yield* Effect.log("Day 4")
  const fs = yield* FileSystem.FileSystem
  const input = yield* fs.readFileString("puzzle-input/day4")

})
