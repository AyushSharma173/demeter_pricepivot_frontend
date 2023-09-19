const express = require('express')
const app = express()
const axios = require('axios').default
const path = require('path')
const fs = require('fs')
const assets = ['png', 'jpg']
app.get('*', function (req, res) {
  //console.log(req.url)
  // console.log(req.headers)
  // console.log(req.body)

  const IS_IMAGE = assets.includes(req.url.split('?')[0].split('.').slice(-1)[0])
  const localPath = path.resolve(__dirname, 'buffer', new Date().getTime().toString() + ".png")
  const targetURL = "http://glp-sheharyar:8081" + req.url
  console.log("->", targetURL)
  let task = IS_IMAGE ?
    axios({
      method: 'GET',
      url: targetURL,
      responseType: 'stream'
    })
    :
    axios.get(targetURL, {
      headers: req.headers['content-type'] ? {
        'content-type': req.headers['content-type']
      } : undefined
    });

  task.then(x => {

    if (IS_IMAGE) {

      x.data.pipe(fs.createWriteStream(localPath)).on('finish', () => {
        console.log('<-',targetURL," returning asset")
        res.sendFile(localPath)
      })

    }
    else {
      console.log('<-', targetURL, x.status)
      res.status(x.status)
      if (x.headers['content-type'])
        res.setHeader('content-type', x.headers['content-type'])

      res.send(x.data)
    }
  }).catch(e => {

    if (e.response?.status) {
      console.log('<-', targetURL, e.response.status)
      res.status(e.response?.status)
      if (e.response?.headers['content-type'])
        res.setHeader('content-type', e.response?.headers['content-type'])
      res.send(e.response?.data)
    }
    else
      console.log("Unhandled", e)
  })

})

app.listen(8081,()=>{
  console.log("Ready!")
})