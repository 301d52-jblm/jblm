'use strict';

// ========== Dependencies ========== //
const fs = require('fs');
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const readline = require('readline');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const googleCalendarAPI = require('./googleapi');
const GCA = new googleCalendarAPI();

// TODO: fix to get event list properly
let eventListCache = GCA.getEventList();

// ========== Environment Variable ========== //
require('dotenv').config();

// ========== Server ========== //
const app = express();
const PORT = process.env.PORT || 3001;

// ========== App Middleware ========== //
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((request, response) => {
  console.log('methodOverride Callback');
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    console.log(method);
    delete request.body._method;
    return method;
  }
}));

// ========== Database Setup ========== //
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => handleError(error));
client.connect();

// ========== Set Views Engine for Templating ========== //
app.set('view engine', 'ejs');

// ========== Routes ========== //

// render the Home page
app.get('/', getHome);
app.get('/upcoming/:count', getUpcoming);
// render the Calendar page that shows a Google Calendar API
app.get('/calendar', getCalendar);
// render the Resource page
app.get('/resources', getResources);

app.get('/calendar/:item_id', getCalendarItemDetail);

app.get('/email', getEmailLink);

app.get('/error', handleError);

app.get('/pdf', testPDF);

app.get('/map', getMap);

app.post('/eventsForm', sendEventEmail);
app.post('/', sendResourcesEmail);

app.get('/response', getResponse);

app.post('/calendar', sendEventEmail);

app.post('/getLocation', getLocation);




// render the Admin page
// app.get('/edit-mode/authority/admin', renderAdmin);
const adminRoute = process.env.ADMIN_ROUTE;

// Make sure we do not set up the routes if ADMIN_ROUTE is not defined.
if (adminRoute) {
  app.get(`/${adminRoute}`, getAdminView);
  app.get(`/${adminRoute}/resource`, getResourceAdminList);
  app.get(`/${adminRoute}/resource/new`, getNewResourceView);
  app.get(`/${adminRoute}/resource/edit/:id`, getEditResourceView);

  // TODO: This route may be redundant.  It would be for a confirmation prompt, but this can be done on the front end.
  app.get(`/${adminRoute}/resource/delete/:id`, getDeleteResourceView);
  app.post(`/${adminRoute}/resource/new`, postNewResource);
  app.post(`/${adminRoute}/resource/edit/:id`, updateResourceForm);
  app.put(`/${adminRoute}/resource/edit/:id`, updateResource);
  app.delete(`/${adminRoute}/resource/delete/:id`, deleteResource);


} else {
  console.log('no ADMIN_ROUTE .env value');
}

// ========== Catch All Other Routes ========== //
app.all('*', (req, res) => {
  res.status(404).send('This route does not exist.');
  console.log(`Route for ${req.method} ${req.originalUrl} does not exist.`);
});

// ========== Route Handlers ========== //

function getHome(req, res) {
  res.render('pages/index');
}

// TODO: eventList cache needs to be better managed!
function getUpcoming(req, res) {
  let eventList = GCA.getEventList();
  console.log('The current event list: \n', eventList);
  res.send(eventList);
}

function getResponse(req, res) {
  res.render('pages/response');
}

function getMap(req, res) {
  res.render('pages/map');
}


function getCalendar(req, res) {
  res.render('pages/calendar');
}

function getResources(req, res) {
  const sql = 'SELECT id, logo_img, title, email, resource_url, description FROM resource ORDER BY title DESC;';

  client
    .query(sql)
    .then(sqlResults => {
      console.log('sql results', sqlResults.rows);
      res.render('pages/resources', { resource: sqlResults.rows });
    })
    .catch(err => handleError(err, res));
}

function getEmailLink(req, res) {
  res.redirect(`${process.env.EMAIL}`);
}

function getCalendarItemDetail(req, res) {
  res.render('pages/calendar/item');
}

function getAdminView(req, res) {
  res.render('pages/admin', { adminRoute: adminRoute })
    .catch(err => handleError(err, res));
}

function getEventAdminList(req, res) {
  res.render('pages/calendar/list');
}

function getNewEventView(req, res) {
  res.render('pages/calendar/new-item');
}

function getEditEventView(req, res) {
  res.render('pages/calendar/edit-item');
}

function getDeleteEventView(req, res) {
  res.render('pages/calendar/delete-item');
}

function postNewEvent(req, res) {
  res.redirect(`/${adminRoute}`);
}

function updateEvent(req, res) {
  res.redirect(`/${adminRoute}`);
}

function deleteEvent(req, res) {
  res.redirect(`/${adminRoute}`);
}

function getResourceAdminList(req, res) {
  const sql = 'SELECT id, logo_img, title, email,resource_url, description FROM resource ORDER BY title DESC;';

  client
    .query(sql)
    .then(sqlResults => {
      res.render('pages/resource/list', {
        adminRoute: adminRoute,
        resource: sqlResults.rows
      });
    })
    .catch(err => handleError(err, res));
}

function getNewResourceView(req, res) {
  res.render('pages/resource/new-item');
}

function getEditResourceView(req, res) {
  res.render('pages/resource/edit-item');
}

function getDeleteResourceView(req, res) {
  // TODO: This route may by redundant
  res.render('pages/resource/delete-item', {
    adminRoute: adminRoute,
  });
}

function postNewResource(req, res) {

  let {
    logo_img,
    title,
    email,
    resource_url,
    description
  } = req.body;
  let values = [logo_img, title, email, resource_url, description];

  let sql = 'INSERT INTO resource (logo_img, title, email, resource_url, description) VALUES($1, $2, $3, $4, $5);';
  client
    .query(sql, values)
    .then(sqlResults => {
      res.redirect(`/${adminRoute}/resource`)
    })
    .catch(err => handleError(err, res));
}

function updateResourceForm(req, res) {
  let sql = `SELECT * FROM resource WHERE id=${req.params.id};`;

  client.query(sql)
    .then(selectedResource => {
      let resource = selectedResource.rows[0];
      console.log(resource);
      res.render('pages/editResource', { resource: resource, adminRoute: adminRoute, });
    })
    .catch(err => handleError(err, res));
}


function updateResource(req, res) {

  let newData = req.body;
  let sql = `UPDATE resource SET logo_img=$1, title=$2, email=$3, resource_url=$4, description=$5 WHERE id=${req.params.id}`;
  let safeValues = [newData.logo_img, newData.title, newData.email, newData.resource_url, newData.description];

  client.query(sql, safeValues)
    .then(results => {
      console.log(`database updated`);
      res.redirect(`/${adminRoute}/resource/`);
    })
    .catch(error => console.error(error));
}


function deleteResource(req, res) {
  let values = [req.params.id];
  let sql = 'DELETE FROM resource WHERE id = $1;';
  console.log('deleteResource() values', values);
  client
    .query(sql, values)
    .then(sqlResults => {
      console.log('deleteResource() success');


      res.redirect(303, `/${adminRoute}/resource`);
    })
    .catch(err => handleError(err, res));
  //res.redirect(`/${adminRoute}`);
}

function testPDF(req, res) {
  var data = fs.readFileSync('./data/test.pdf');
  res.contentType('application/pdf');
  res.send(data);
}

function sendEventEmail(request, response) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jblm.visitor@gmail.com',
      pass: 'codefellows'
    }
  });

  let { requester, requesterEmail, requesterPhone, eventName, date, time, description } = request.body;

  var mailOptions = {
    from: 'jblm.visitor@gmail.com',
    //insert multiple email addresses in the following format
    //`first@email.com;second@email.com;third@email.com`
    to: `lwilber92@gmail.com`,
    subject: 'Please add my event to the Hawk Career Center calendar',
    text: `From: ${requester}\nEmail: ${requesterEmail}\nPhone Number: ${requesterPhone}\nEvent name: ${eventName}\nDate: ${date}\nTime: ${time}\nDescription: ${description}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  //refresh the page after submitting:
  response.redirect('/calendar');
}

function sendResourcesEmail(request, response) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jblm.visitor@gmail.com',
      pass: 'codefellows'
    }
  });
  let { name, email, phone, logoURL, siteURL, description } = request.body;

  var mailOptions = {
    from: 'jblm.visitor@gmail.com',
    //insert multiple email addresses in the following format
    //`first@email.com;second@email.com;third@email.com`
    to: `lwilber92@gmail.com`,
    subject: 'Please add me to your HAWK Career Center Resources.',
    text: `From: ${name}\nEmail: ${email}\nPhone Number: ${phone}\nLogo URL: ${logoURL}\nWebsite: ${siteURL}\nDescription: ${description}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


function getLocation(request, response) {
  let location = request.body.location;

  superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.LOCATION_API_KEY}`)
    .then(resultsFromSuperagent => {
      let yourAddress = resultsFromSuperagent.body.results[0].formatted_address;
      let hawkAddress = '11577 41st Division Drive (Lewis North), Joint Base Lewis McChord, WA';
      let directionsURL = `http://maps.google.com/maps?saddr="${yourAddress}"&daddr=${hawkAddress}`;
      response.redirect(directionsURL);
    })
    .catch(error => console.error(error));

}


// ========== Error Function ========== //
function handleError(err, response) {
  console.log('ERROR START ==================');
  console.error(err);
  console.log('ERROR END ====================');

  if (response) {
    response
      .status(500)
      .render('pages/error', {
        // header: 'Uh Oh something went wrong :(',
        error: err.toString()
      });
  }
}




// ========== Listen on PORT ==========
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
