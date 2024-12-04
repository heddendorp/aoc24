import { FileSystem } from "@effect/platform"
import { Effect, Sink, Stream } from "effect"

export const day1 = Effect.gen(function*() {
  yield* Effect.log("Day 1")
  const fs = yield* FileSystem.FileSystem
  const input1 = yield* fs.readFileString("puzzle-input/day1-1")
  const lines = input1.split("\n").filter((line) => line.length > 4)
  const leftNumbers = lines.map((line) => line.split("   ").map((number) => Number(number.trim()))[0])
  const rightNumbers = lines.map((line) => line.split("   ").map((number) => Number(number.trim()))[1])
  const sortedLeft = leftNumbers.toSorted((a, b) => a - b)
  const sortedRight = rightNumbers.toSorted((a, b) => a - b)
  const rightStream = Stream.fromIterable(sortedRight)
  const leftStream = Stream.fromIterable(sortedLeft)
  const difference = Stream.zipWith(rightStream, leftStream, (a, b) => Math.abs(a - b))
  const occurances = Stream.mapEffect(leftStream, (a) =>
    Effect.gen(function*() {
      const count = yield* Stream.run(Stream.filter(rightStream, (b) => b === a), Sink.count)
      return [a, count]
    }))
  const similarity = Stream.map(occurances, ([a, b]) => a * b)
  const result = yield* Stream.run(difference, Sink.sum)
  yield* Effect.log(`Result of Puzzle 1: ${result}`)
  const result2 = yield* Stream.run(similarity, Sink.sum)
    yield* Effect.log(`Result of Puzzle 2: ${result2}`)
})
