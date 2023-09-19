// This is for windows only.
const { execSync } = require('child_process')
const fs = require('fs')
const { cwd } = require('process')
const mobileDir = cwd().replace("\\web", "\\mobile")
const DEAD_TIME_MILLIS = 100

let startTimeMillis = 0

console.log("Watching ", mobileDir, " with dead time of ", DEAD_TIME_MILLIS)

fs.watch(mobileDir, { recursive: true }, (e, f) => {
    let currentTimeMillis = new Date().getTime()
    if (currentTimeMillis > startTimeMillis + DEAD_TIME_MILLIS) {
        console.log(e, f)
        console.log(execSync("refresh").toString())
        startTimeMillis = currentTimeMillis
    }
})  