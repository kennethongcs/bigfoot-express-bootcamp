import express from 'express';
import { read } from './dataStorage.js';
import sortBy from 'lodash/sortBy.js';

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  read('data.json', (err, content) => {
    if (err) {
      console.log('Read error ejs', err);
    }
    const data = content.sightings;
    res.render('sightings', { data });
  });
});

app.get('/sightings/:index', (request, response) => {
  read('data.json', (err, content) => {
    const sightings = content.sightings[request.params.index];
    content = `
      <html>
        <body>
          <h1>hello</h1>
          ${sightings.YEAR}<br/>
          ${sightings.STATE}<br/>
          ${sightings.OBSERVED}<br/><br/>

          Click <a href="/">here</a> to go back to index. 
        </body>
      </html>
    `;
    const content2 = '';
    response.send(content);
  });
});

app.get('/year-sightings/:year', (request, response) => {
  read('data.json', (err, content) => {
    const sightings = content.sightings;
    const filteredSightings = sightings.filter((sighting) => {
      return sighting.YEAR === request.params.year;
    });
    let string = '';
    filteredSightings.forEach((sighting) => {
      string += `${sighting.YEAR}<br/>`;
      string += `${sighting.STATE}<br/>`;
    });
    content = `
      <html>
        <body>
          <h1>hello</h1>
          ${string}<br/>
        </body>
      </html>
    `;
    const content2 = '';
    response.send(content);
  });
});

app.get('/year-sightings', (request, response) => {
  read('data.json', (err, content) => {
    const sightings = content.sightings;
    // sightings.sort((a, b) => {
    //   if (request.query.sort === 'asc') {
    //     if (a.STATE < b.STATE) {
    //       return -1;
    //     }
    //     if (a.STATE > b.STATE) {
    //       return 1;
    //     }
    //     return 0;
    //   }
    // });

    const sortedSightings = sortBy(sightings, ['STATE']);

    // console.log(sightings);
    const string = sortedSightings.map((sighting) => {
      return `${sighting.STATE}<br/>`;
    });
    // string.sort();
    console.log(string);
    content = `
      <html>
        <body>
          <h1>hello</h1>
          ${string}<br/>
        </body>
      </html>
    `;
    const content2 = '';
    response.send(content);
  });
});

app.get('/apple', (req, res, next) => {
  console.log('Apple');
  // res.send('<h2> Hello </h2>');
  next();
});
app.get('/apple', (req, res) => {
  console.log('Goodbye');
  res.send('<h2> Hello </h2>');
});

app.listen(3004);
