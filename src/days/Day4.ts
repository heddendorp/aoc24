import { FileSystem } from "@effect/platform"
import { Effect } from "effect"

const horizontalSearch = (input: Array<Array<string>>, search: string) => {
  const reversedSearch = search.split("").reverse().join("")
  let result = 0
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x <= input[y].length - search.length; x++) {
      const stringToCheck = input[y].slice(x, x + search.length).join("")
      if (stringToCheck === search) {
        result++
      }
      if (stringToCheck === reversedSearch) {
        result++
      }
    }
  }
  return Effect.succeed(result)
}

const verticalSearch = (input: Array<Array<string>>, search: string) => {
  const reversedSearch = search.split("").reverse().join("")
  let result = 0
  for (let y = 0; y <= input.length - search.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      let currentString = ""
      for (let yOffset = 0; yOffset < search.length; yOffset++) {
        currentString += input[y + yOffset][x]
      }
      if (currentString === search) {
        result++
      }
      if (currentString === reversedSearch) {
        result++
      }
    }
  }
  return Effect.succeed(result)
}

const tlToBrSearch = (input: Array<Array<string>>, search: string) => {
  const reversedSearch = search.split("").reverse().join("")
  let result = 0
  for (let y = 0; y <= input.length - search.length; y++) {
    for (let x = 0; x <= input[y].length - search.length; x++) {
      let yOffset = 0
      let xOffset = 0
      let currentString = ""
      while (yOffset < search.length && xOffset < search.length) {
        currentString += input[y + yOffset][x + xOffset]
        if (currentString === search) {
          result++
        }
        if (currentString === reversedSearch) {
          result++
        }
        yOffset++
        xOffset++
      }
    }
  }
  return Effect.succeed(result)
}

const trToBlSearch = (input: Array<Array<string>>, search: string) => {
  const reversedSearch = search.split("").reverse().join("")
  let result = 0
  for (let y = 0; y <= input.length - search.length; y++) {
    for (let x = search.length - 1; x < input[y].length; x++) {
      let yOffset = 0
      let xOffset = 0
      let currentString = ""
      while (yOffset < search.length && xOffset < search.length) {
        currentString += input[y + yOffset][x - xOffset]
        if (currentString === search) {
          result++
        }
        if (currentString === reversedSearch) {
          result++
        }
        yOffset++
        xOffset++
      }
    }
  }
  return Effect.succeed(result)
}

const xmasSearch = (input: Array<Array<string>>) => {
  let result = 0
  for (let y = 0; y < input.length - 2; y++) {
    for (let x = 0; x < input[y].length - 2; x++) {
      if (input[y + 1][x + 1] !== "A") {
        continue
      }
      if (input[y][x] === "M") {
        if (input[y + 2][x + 2] !== "S") {
          continue
        }
      } else if (input[y][x] === "S") {
        if (input[y + 2][x + 2] !== "M") {
          continue
        }
      } else {
        continue
      }
      if (input[y][x + 2] === "M") {
        if (input[y + 2][x] !== "S") {
          continue
        }
      } else if (input[y][x + 2] === "S") {
        if (input[y + 2][x] !== "M") {
          continue
        }
      } else {
        continue
      }
      result++
    }
  }
  return Effect.succeed(result)
}

export const day4 = Effect.gen(function*() {
  yield* Effect.log("Day 4")
  const fs = yield* FileSystem.FileSystem
  const input = yield* fs.readFileString("puzzle-input/day4")
  const lines = input.split("\n").filter((line) => line.length > 4).map((line) => line.trim().split(""))
  const search = "XMAS"
  const results = yield* Effect.all([
    horizontalSearch(lines, search),
    verticalSearch(lines, search),
    tlToBrSearch(lines, search),
    trToBlSearch(lines, search)
  ])
  const result = results.reduce((acc, current) => acc + current, 0)
  yield* Effect.log(`Result of Puzzle 1: ${results}`)
  yield* Effect.log(`Result of Puzzle 1: ${result}`)
  const xmasResult = yield* xmasSearch(lines)
  yield* Effect.log(`Result of Puzzle 2: ${xmasResult}`)
})
