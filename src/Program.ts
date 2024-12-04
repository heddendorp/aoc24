import { BunContext, BunRuntime } from "@effect/platform-bun"
import * as Effect from "effect/Effect"
import { day1 } from "./days/Day1.js"
import { day2 } from "./days/Day2.js"
import { day3 } from "./days/Day3.js"
import { day4 } from "./days/Day4.js"

const program = Effect.gen(function*() {
  yield* Effect.log("Advent of code 2024")
  yield* day1
  yield* day2
  yield* day3
  yield* day4
})

const programWithDependencies = program.pipe(
  Effect.provide(BunContext.layer)
)

BunRuntime.runMain(programWithDependencies)
