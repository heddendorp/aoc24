import { FileSystem } from "@effect/platform"
import { Chunk, Effect, Option, Sink, Stream } from "effect"

const isSafe = ([previous, current, next]: [Option.Option<number>, number, Option.Option<number>]) => {
  if (Option.isNone(previous) || Option.isNone(next)) {
    return true
  }
  const prevValue = previous.value
  const nextValue = next.value

  if (prevValue === current || nextValue === current) {
    return false
  }

  if (Math.abs(prevValue - current) > 3 || Math.abs(nextValue - current) > 3) {
    return false
  }

  if (prevValue > current && current < nextValue) {
    return false
  }

  return !(prevValue < current && current > nextValue)
}

const isLineSafe = (line: Stream.Stream<[Option.Option<number>, number, Option.Option<number>]>) =>
  Stream.run(line, Sink.foldLeft(true, (acc, current) => acc && isSafe(current)))

const removeOneUnsafe = (line: Stream.Stream<number>) => {
  return Effect.gen(function*() {
    const lineSafe = yield* isLineSafe(line.pipe(Stream.zipWithPreviousAndNext))
    if (lineSafe) {
      return line.pipe(Stream.zipWithPreviousAndNext)
    }
    const entries = yield* Stream.run(line, Sink.collectAll())
    for (let i = 0; i < entries.length; i++) {
      const newLine = Stream.fromChunk(Chunk.remove(entries, i)).pipe(Stream.zipWithPreviousAndNext)
      const lineSafe = yield* isLineSafe(newLine)
      if (lineSafe) {
        yield* Effect.logDebug(`Removed ${i}`)
        return newLine
      }
    }
    return line.pipe(Stream.zipWithPreviousAndNext)
  })
}

const filledLine = (line: string) => !!line.length

const lineToNumbers = (line: string) =>
  Stream.fromIterable(line.trim().split(" ").map((number) => Number(number.trim()))).pipe(Stream.zipWithPreviousAndNext)

const lineToNumbers2 = (line: string) =>
  Stream.fromIterable(line.trim().split(" ").map((number) => Number(number.trim())))

export const day2 = Effect.gen(function*() {
  yield* Effect.log("Day 2")
  const fs = yield* FileSystem.FileSystem
  const input1 = yield* fs.readFileString("puzzle-input/day2")
  const lineStream = Stream.fromIterable(input1.split("\n")).pipe(Stream.filter((line) => filledLine(line)))
  const safeLines = yield* Stream.map(lineStream, lineToNumbers).pipe(
    Stream.map((line) => isLineSafe(line)),
    Stream.filterEffect((line) => line),
    Stream.run(Sink.count)
  )
  yield* Effect.log(`Result of Puzzle 1: ${safeLines}`)
  const dampSafeLines = yield* Stream.map(lineStream, lineToNumbers2).pipe(
    Stream.mapEffect((line) => removeOneUnsafe(line)),
    Stream.map((line) => isLineSafe(line)),
    Stream.filterEffect((line) => line),
    Stream.run(Sink.count)
  )
  yield* Effect.log(`Result of Puzzle 2: ${dampSafeLines}`)
})
