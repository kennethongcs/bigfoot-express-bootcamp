import express from 'express';
import { read } from './dataStorage.js';
import sortBy from 'lodash/sortBy.js';

const app = express();
app.set('view engine', 'ejs');

// ejs - display entire list of sightings
app.get('/', (req, res) => {
  read('data.json', (err, content) => {
    if (err) {
      console.log('Read error ejs', err);
    }
    const data = content.sightings;
    res.render('sightings', { data });
  });
});
// ejs - display entire list of sightings by years
app.get('/years', (req, res) => {
  read('data.json', (err, content) => {
    if (err) {
      console.log('Read error ejs', err);
    }
    const data = content.sightings;
    // extract years from DATA into new var
    const dataYears = data.map((years) => {
      return years.YEAR;
    });
    // remove duplicates and add into new array
    const dataYearsNoDupes = [...new Set(dataYears)];
    // sort(?) in ascending order
    dataYearsNoDupes.sort((a, b) => {
      return a - b;
    });
    res.render('years', { dataYearsNoDupes });
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
    string += `<h1>Year: ${request.params.year}<br/></h1>`;
    filteredSightings.forEach((sighting) => {
      string += `${sighting.STATE}<br/>`;
    });
    content = `
      <html>
        <body>
        Click <a href="/years"> here </a> to go back to list of years.
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
    const { sightings } = content;
    // sort sightings in ascending order
    const sortedSightings = sortBy(sightings, ['STATE']);
    // console.log(sightings);
    const string = sortedSightings.map((sighting) => {
      return `${sighting.STATE}<br/>`;
    });
    // string.sort();
    content = `
      <html>
        <body>
          <h1>hello</h1>
          ${string}<br/>
        </body>
      </html>
    `;
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
