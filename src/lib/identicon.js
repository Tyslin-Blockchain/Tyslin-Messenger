/**
 * Reference implementation:
 * @url https://github.com/Tyslin-im/tyslin-iOS/blob/develop/Tyslin/Services/TyslinAvatarService
 * .swift
 */
'use strict'

import md5 from 'js-md5'

export default class Identicon {
  constructor () {
    this.MAX_INT32 = Math.pow(2, 31) - 1 // 32-bit signed integer
    this.colors = [
      [
        '#ffffff', // background
        '#179cec', // main
        '#8bcef6', // 2dary
        '#c5e6fa' // 2dary
      ],
      [
        '#ffffff', // background
        '#32d296', // main
        '#99e9cb', // 2dary
        '#ccf4e5' // 2dary
      ],
      [
        '#ffffff', // background
        '#faa05a', // main
        '#fdd0ad', // 2dary
        '#fee7d6' // 2dary
      ],
      [
        '#ffffff', // background
        '#474a5f', // main
        '#a3a5af', // 2dary
        '#d1d2d7' // 2dary
      ],
      [
        '#ffffff', // background
        '#9497a3', // main
        '#cacbd1', // 2dary
        '#e4e5e8' // 2dary
      ]
    ]
    this.cache = null
    this.avatar = function (canvas, key, size) {
      // Sizes lower than 40 may cause aspect ration distortion
      if (size && size < 40) throw Error('Identicon size can not be smaller than 40')
      this.cache = canvas.getContext('2d')
      this.Hexa16(key, size || 40)
    }
  }
  Hexa16 (key, size) {
    let fringeSize = size / 6
    let distance = this.distanceTo3rdPoint(fringeSize)
    let lines = size / fringeSize
    let offset = ((fringeSize - distance) * lines) / 2
    let fillTriangle = this.triangleColors(0, key, Math.trunc(lines))
    let transparent = 'rgba(0, 0, 0, 0)'
    let isLeft = v => v % 2 === 0
    let isRight = v => v % 2 !== 0
    let L = Math.trunc(lines)
    let hL = L / 2
    let xL = 0
    let yL = 0
    for (xL = 0; xL < hL; xL++) {
      for (yL = 0; yL < L; yL++) {
        /* if (this.isOutsideHexagon(xL, yL, Math.trunc(lines))) {
          continue
        } */
        var x1, x2, y1, y2, y3
        if (xL % 2 === 0) {
          let result = this.right1stTriangle(xL, yL, fringeSize, distance)
          x1 = result.x1
          y1 = result.y1
          x2 = result.x2
          y2 = result.y2
          y3 = result.y3
        } else {
          let result = this.left1stTriangle(xL, yL, fringeSize, distance)
          x1 = result.x1
          y1 = result.y1
          x2 = result.x2
          y2 = result.y2
          y3 = result.y3
        }
        let xs = [x2 + offset, x1 + offset, x2 + offset]
        let ys = [y1, y2, y3]
        let fill = this.canFill(xL, yL, fillTriangle, isLeft, isRight)
        if (fill) {
          this.Polygon(xs, ys, fill)
        } else {
          this.Polygon(xs, ys, transparent)
        }
        let xsMirror = this.mirrorCoordinates(xs, lines, distance, offset * 2)
        let xLMirror = lines - xL - 1.0
        let yLMirror = yL
        fill = this.canFill(Math.trunc(xLMirror), yLMirror, fillTriangle, isLeft, isRight)
        if (fill) {
          this.Polygon(xsMirror, ys, fill)
        } else {
          this.Polygon(xsMirror, ys, transparent)
        }
        var x11, x12, y11, y12, y13
        if (xL % 2 === 0) {
          let result = this.left2ndTriangle(xL, yL, fringeSize, distance)
          x11 = result.x1
          y11 = result.y1
          x12 = result.x2
          y12 = result.y2
          y13 = result.y3
          // in order to have a perfect hexagon,
          // we make sure that the previous triangle and this one touch each other in this point.
          y12 = y3
        } else {
          let result = this.right2ndTriangle(xL, yL, fringeSize, distance)
          x11 = result.x1
          y11 = result.y1
          x12 = result.x2
          y12 = result.y2
          y13 = result.y3
          // in order to have a perfect hexagon,
          // we make sure that the previous triangle and this one touch each other in this point.
          y12 = y1 + fringeSize
        }
        var xs1 = [x12 + offset, x11 + offset, x12 + offset]
        let ys1 = [y11, y12, y13]
        // triangles that go to the right
        fill = this.canFill(xL, yL, fillTriangle, isRight, isLeft)
        if (fill) {
          this.Polygon(xs1, ys1, fill)
        } else {
          this.Polygon(xs1, ys1, transparent)
        }
        xs1 = this.mirrorCoordinates(xs1, lines, distance, offset * 2)
        fill = this.canFill(Math.trunc(xLMirror), yLMirror, fillTriangle, isRight, isLeft)
        if (fill) {
          this.Polygon(xs1, ys1, fill)
        } else {
          this.Polygon(xs1, ys1, transparent)
        }
      }
    }
  }
  Polygon (xs, ys, color) {
    this.cache.beginPath()
    for (let i = 0; i < xs.length; i++) {
      let x = xs[i]
      let y = ys[i]
      if (i === 0) {
        this.cache.moveTo(x, y)
      } else {
        this.cache.lineTo(x, y)
      }
    }
    this.cache.fillStyle = color
    this.cache.fill()
  }
  distanceTo3rdPoint (AC) {
    // distance from center of vector to third point of equilateral triangles
    // ABC triangle, O is the center of AB vector
    // OC = SQRT(AC^2 - AO^2)
    return Math.ceil(Math.sqrt((AC * AC) - (AC / 2 * AC / 2)))
  }
  // right1stTriangle computes a right oriented triangle '>'
  right1stTriangle (xL, yL, fringeSize, distance) {
    let x1 = xL * distance
    let x2 = xL * distance + distance
    let x3 = x1
    let y1 = yL * fringeSize
    let y2 = y1 + fringeSize / 2
    let y3 = yL * fringeSize + fringeSize
    return { x1, y1, x2, y2, x3, y3 }
  }
  // left1stTriangle computes the coordinates of a left oriented triangle '<'
  left1stTriangle (xL, yL, fringeSize, distance) {
    let x1 = xL * distance + distance
    let x2 = xL * distance
    let x3 = x1
    let y1 = yL * fringeSize
    let y2 = y1 + fringeSize / 2
    let y3 = yL * fringeSize + fringeSize
    return { x1, y1, x2, y2, x3, y3 }
  }
  // left2ndTriangle computes the coordinates of a left oriented triangle '<'
  left2ndTriangle (xL, yL, fringeSize, distance) {
    let x1 = xL * distance + distance
    let x2 = xL * distance
    let x3 = x1
    let y1 = yL * fringeSize + fringeSize / 2
    let y2 = y1 + fringeSize / 2
    let y3 = yL * fringeSize + fringeSize + fringeSize / 2
    return { x1, y1, x2, y2, x3, y3 }
  }
  // right2ndTriangle computes the coordinates of a right oriented triangle '>'
  right2ndTriangle (xL, yL, fringeSize, distance) {
    let x1 = xL * distance
    let x2 = xL * distance + distance
    let x3 = x1
    let y1 = yL * fringeSize + fringeSize / 2
    let y2 = yL + fringeSize
    let y3 = yL * fringeSize + fringeSize / 2 + fringeSize
    return { x1, y1, x2, y2, x3, y3 }
  }
  mirrorCoordinates (xs, lines, fringeSize, offset) {
    var xsMirror = []
    for (let i = 0; i < xs.length; i++) {
      xsMirror.push((lines * fringeSize) - xs[i] + offset)
    }
    return xsMirror
  }
  triangleColors (id, key, lines) {
    let keyHash = md5(key)
    /* if (keyHash.length !== 32) {
      throw new Error('TyslinIdenticon: Wrong md5 hash')
    } */
    var tColors = []
    var rawKeyArray = []
    for (const u of keyHash) {
      rawKeyArray.push(u.charCodeAt())
    }
    const reducer = (accum, crntValue) => accum + crntValue
    let seed = this.scramble(rawKeyArray.reduce(reducer)) // sum of all values
    // process hash values to number array with 10 values. 1 - avatar color set (merge first 5), 2-10 - values for triange colors (merged by 3 values)
    var keyArray = []
    keyArray.push(rawKeyArray.slice(0, 5).reduce(reducer)) // merge first 5
    for (let i = 5; i < 32; i += 3) {
      keyArray.push(rawKeyArray.slice(i, i + 3).reduce(reducer)) // merge rest by 3
    }
    let setId = seed % this.getValue(keyHash, keyArray[0])
    let colorsSet = this.colors[setId % this.colors.length]
    for (let i = 0; i < Triangle.triangles[id].length; i++) {
      let t = Triangle.triangles[id][i]
      let x = t.x
      let y = t.y
      let index = x + 3 * y + lines + seed % this.getValue(keyHash, keyArray[i + 1])
      let color = this.PickColor(keyHash, colorsSet, index)
      tColors.push(color)
    }
    return tColors
  }
  scramble (seed) {
    let multiplier = 0x5DEEC
    let mask = (1 << 30) - 1
    return (seed ^ multiplier) & mask
  }
  getValue (string, index) {
    let s = String(string[index % string.length])
    return s.charCodeAt()
  }
  isOutsideHexagon (xL, yL, lines) {
    return !this.isFill1InHexagon(xL, yL, lines) && !this.isFill2InHexagon(xL, yL, lines)
  }
  isFill1InHexagon (xL, yL, lines) {
    let half = lines / 2
    let start = half / 2
    if (xL < start + 1) {
      if (yL > start - 1 && yL < start + half + 1) {
        return true
      }
    }
    if (xL === half - 1) {
      if (yL > start - 1 - 1 && yL < start + half + 1 + 1) {
        return true
      }
    }
    return false
  }
  isFill2InHexagon (xL, yL, lines) {
    let half = lines / 2
    let start = half / 2
    if (xL < start) {
      if (yL > start - 1 && yL < start + half) {
        return true
      }
    }
    if (xL === 1) {
      if (yL > start - 1 - 1 && yL < start + half + 1) {
        return true
      }
    }
    if (xL === half - 1) {
      if (yL > start - 1 - 1 && yL < start + half + 1) {
        return true
      }
    }
    return false
  }
  // PickColor returns a color given a key string, an array of colors and an index.
  // key: should be a md5 hash string.
  // index: is an index from the key string.
  // Algorithm: PickColor converts the key[index] value to a decimal value.
  // We pick the ith colors that respects the equality value%numberOfColors == i.
  PickColor (key, colors, index) {
    let n = colors.length
    let i = this.PickIndex(key, n, index)
    return colors[i]
  }
  // PickIndex returns an index of given a key string, the size of an array of colors
  //  and an index.
  // key: should be a md5 hash string.
  // index: is an index from the key string.
  // Algorithm: PickIndex converts the key[index] value to a decimal value.
  // We pick the ith index that respects the equality value%sizeOfArray == i.
  PickIndex (key, n, index) {
    let r = this.getValue(key, index)
    for (let i = 0; i < n; i++) {
      if (r % n === i) {
        return i
      }
    }
    return 0
  }
  // canFill returns a fill svg string given position. the fill is computed to be a rotation of the
  // triangle 0 with the 'fills' array given as param.
  canFill (x, y, fills, isLeft, isRight) {
    let l = new Triangle(x, y, 'left')
    let r = new Triangle(x, y, 'right')
    if (isLeft(x) && l.isInTriangle()) {
      let rid = l.rotationID()
      return fills[rid]
    } else if (isRight(x) && r.isInTriangle()) {
      let rid = r.rotationID()
      return fills[rid]
    }
    return null
  }
}

class Triangle {
  constructor (x, y, direction) {
    this.x = x
    this.y = y
    this.direction = { 'left': 0, 'right': 1 }[direction]
  }
  isInTriangle () {
    return this.triangleID() !== -1
  }
  // triangleID returns the triangle id (from 0 to 5)
  // that has a match with the position given as param.
  // returns -1 if a match is not found.
  triangleID () {
    for (let i = 0; i < Triangle.triangles.length; i++) {
      let t = Triangle.triangles[i]
      for (let i2 = 0; i2 < t.length; i2++) {
        let ti = t[i2]
        if (ti.x === this.x && ti.y === this.y && this.direction === ti.direction) {
          return i
        }
      }
    }
    return -1
  }
  // subTriangleID returns the sub triangle id (from 0 to 8)
  // that has a match with the position given as param.
  // returns -1 if a match is not found.
  subTriangleID () {
    for (let i = 0; i < Triangle.triangles.length; i++) {
      let t = Triangle.triangles[i]
      for (let i2 = 0; i2 < t.length; i2++) {
        let ti = t[i2]
        if (ti.x === this.x && ti.y === this.y && this.direction === ti.direction) {
          return i2
        }
      }
    }
    return -1
  }
  subTriangleRotations (lookforSubTriangleID) {
    let m = {
      0: [0, 6, 8, 8, 2, 0],
      1: [1, 2, 5, 7, 6, 3],
      2: [2, 0, 0, 6, 8, 8],
      3: [3, 4, 7, 5, 4, 1],
      4: [4, 1, 3, 4, 7, 5],
      5: [5, 7, 6, 3, 1, 2],
      6: [6, 3, 1, 2, 5, 7],
      7: [7, 5, 4, 1, 3, 4],
      8: [8, 8, 2, 0, 0, 6]
    }
    return m[lookforSubTriangleID]
  }
  // rotationId returns the original sub triangle id
  // if the current triangle was rotated to position 0.
  rotationID () {
    let currentTID = this.triangleID()
    let currentSTID = this.subTriangleID()
    let numberOfSubTriangles = 9
    for (let i = 0; i < numberOfSubTriangles; i++) {
      let rotations = this.subTriangleRotations(i)
      if (rotations) {
        if (rotations[currentTID] === currentSTID) {
          return i
        }
      }
    }
    return -1
  }
}
Triangle.triangles = [
  [
    new Triangle(0, 1, 'right'),
    new Triangle(0, 2, 'right'),
    new Triangle(0, 3, 'right'),
    new Triangle(0, 2, 'left'),
    new Triangle(0, 3, 'left'),
    new Triangle(1, 2, 'right'),
    new Triangle(1, 3, 'right'),
    new Triangle(1, 2, 'left'),
    new Triangle(2, 2, 'right')
  ],
  [
    new Triangle(0, 1, 'left'),
    new Triangle(1, 1, 'right'),
    new Triangle(1, 0, 'left'),
    new Triangle(1, 1, 'left'),
    new Triangle(2, 0, 'right'),
    new Triangle(2, 1, 'right'),
    new Triangle(2, 0, 'left'),
    new Triangle(2, 1, 'left'),
    new Triangle(2, 2, 'left')
  ],
  [
    new Triangle(3, 0, 'right'),
    new Triangle(3, 1, 'right'),
    new Triangle(3, 2, 'right'),
    new Triangle(3, 0, 'left'),
    new Triangle(3, 1, 'left'),
    new Triangle(4, 0, 'right'),
    new Triangle(4, 1, 'right'),
    new Triangle(4, 1, 'left'),
    new Triangle(5, 1, 'right')
  ],
  [
    new Triangle(3, 2, 'left'),
    new Triangle(4, 2, 'right'),
    new Triangle(4, 2, 'left'),
    new Triangle(4, 3, 'left'),
    new Triangle(5, 2, 'right'),
    new Triangle(5, 3, 'right'),
    new Triangle(5, 1, 'left'),
    new Triangle(5, 2, 'left'),
    new Triangle(5, 3, 'left')
  ],
  [
    new Triangle(3, 3, 'right'),
    new Triangle(3, 4, 'right'),
    new Triangle(3, 5, 'right'),
    new Triangle(3, 3, 'left'),
    new Triangle(3, 4, 'left'),
    new Triangle(4, 3, 'right'),
    new Triangle(4, 4, 'right'),
    new Triangle(4, 4, 'left'),
    new Triangle(5, 4, 'right')
  ],
  [
    new Triangle(0, 4, 'left'),
    new Triangle(1, 4, 'right'),
    new Triangle(1, 3, 'left'),
    new Triangle(1, 4, 'left'),
    new Triangle(2, 3, 'right'),
    new Triangle(2, 4, 'right'),
    new Triangle(2, 3, 'left'),
    new Triangle(2, 4, 'left'),
    new Triangle(2, 5, 'left')
  ]
]

/* function randomDistribution (seed) {
  return {
    seed: seed,
    a: 0x5DEECE66D, // 25214903917
    c: 11,
    m: Math.pow(2, 45), // 35184372088832
    nextInt: function () {
      this.seed = (this.seed * this.a + this.c) % this.m
      return this.seed
    },
    nextFloat: function () {
      return this.nextInt() / this.m
    },
    nextFloatRange: function (min, max) {
      return min + this.nextFloat() * (max - min)
    },
    nextIntRange: function (min, max) {
      return Math.floor(this.nextFloatRange(min, max))
    }
  }
} */
