const path = require('path');
const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const childProcess = require('child_process');
const fs = require('fs');
const publicPath = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 5000;

app.use(express.static(publicPath));


app.post('/analyzeSong', multipartMiddleware, (req, res) => {
  // console.log(req.files.files[0]);
  try {
    if (fs.existsSync(req.files.files[0].path)) {
      console.log(`File uploaded: ${req.files.files[0].path}`)
    }
  } catch(err) {
    console.error(err);
    res.json({
      error: 'No file was transferred'
    });
  }


  childProcess.exec(`julia julia/liederkreis.jl ${req.files.files[0].path}`, (error, stdout, stderr) => {
    if (error) {
      // console.log(stdout);

      console.log(error);
      res.json({
        error: error.message,
        stdout,
        stderr
      });
      return;
    }

    console.log(stdout);

    res.json({
      data: stdout.split('\n').map(row => row.split('-').slice(2).map(parseFloat)).filter(arr => arr.length),
      error: stderr
    });
  });
});



app.get('*', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));

app.listen(port, () => console.log(`You can now view your project in the browser.\n\tLocal:            http://localhost:${port}`));