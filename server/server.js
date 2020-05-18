const path = require('path');
const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const childProcess = require('child_process');
const fs = require('fs')
const publicPath = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 5000;
// const bodyParser = require('body-parser');
// app.use(bodyParser);
app.use(express.static(publicPath));


app.post('/analyzeSong', multipartMiddleware, (req, res) => {
  // console.log(req)
  // console.log(req.body, req.files);
  // console.log(req.files);
  console.log(req.files.files[0]);
  try {
    if (fs.existsSync(req.files.files[0].path)) {
      console.log(`existsSync: ${req.files.files[0].path}`)
    }
  } catch(err) {
    console.error(err)
  }


  childProcess.exec(`julia liederkreis_hard/liederkreis.jl /app/${req.files.files[0].path}`, (error, stdout, stderr) => {
    try {
      if (fs.existsSync(req.files.files[0].path)) {
        console.log(`existsSync: ${req.files.files[0].path}`)
      }
    } catch(err) {
      console.error(err)
    }


    if (error) {
      console.error(error);
      res.json({
        error: error.message
      });
      return;
    }

    if (stderr) {

      console.log('stderr: ', stderr);
      // res.json({
      //   error: stderr
      // });
    }

    console.log(stdout);


    res.json({
      data: stdout,
      error: stderr
    });
  });
});



app.get('*', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));

app.listen(port, () => console.log(`You can now view your project in the browser.\n\tLocal:            http://localhost:${port}`));