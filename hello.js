const superagent = require('superagent').agent();
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const port = 8080;
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

let username = "";
let password = "";
let json = "";
let $ = "";
let dashboard = "";
let title = "";
var clocked_in = false;
app.set('json spaces', 2);
app.get('/hello.js/', function(req, res) {
  username = req.query.username;
  password = req.query.password;
  start_day = req.query.start_day;
  end_day = req.query.end_day;
  let x = false;
  if (username && password && start_day && end_day)
  {
const ytm = async () => {
  var ss = "2034331";


  var url = "https://app.shiftboard.com/servola/auth.cgi?auth_user=" + username + "&auth_password=" + password;

  dashboard = await superagent.get(url);
  //res.send(dashboard.text);
  let getUserInfo = await superagent.get('https://app.shiftboard.com/servola/security/security.cgi?account_detail=1');
  $ = cheerio.load(getUserInfo.text);

  switch($('nav a span').text())
  {
    case "Clocked In":
    clocked_in = true;
    break;

    default:
    clocked_in = false;
    break;
  }

  if (!clocked_in)
  {
    json = {"error": "You are currently clocked in. Please clock out and try again so that the API can retrieve the latest data."};
    res.send(json);
  }

  let account_information = [];

  $('span.heading').each((_, e) => {
    account_information.push($(e).text());
  });

  var info = {};
  info['id'] = account_information[0];
  info['display_name'] = account_information[1];

  let owner = "2053039";
  let referral = await superagent.get('https://app.shiftboard.com/servola/timecard/timecard.cgi?search=1&timecard_detail=1&owner=' + owner + '&start_month=3&start_day=' + start_day + '&start_year=2023&end_month=3&end_day=' + end_day + '&end_year=2023&total_date=on');

  $ = cheerio.load(referral.text);
  title = $('title').text();

  if (title != "Timecard > Summary")
  {
    json = {"error": "Shiftboard was unable to authenticate this request. Check your credentials and try again."};
    res.send(json);
  }


 // "#results_grid_inner_table > tbody > tr:nth-child(2) > td:nth-child(1)")
  let time = [];
  $('td:nth-child(1)').after(';');
  $('tr').each((_, e) => {

    let row  = $(e).text().replace(/(\s+)/g, ' ');
    time.push(row.split(';'));
    console.log(row.split(';'))
    //console.log(`${row}`);
  });
  time.shift();
  time.pop();

var format = "";
for(let i = 0; i < time.length; i++)
{
  format = time[i][0].split('-');
  format[1] = monthNames[format[1].replace('0', '') - 1];
  time[i][0] = format[2] + '-' + format[1] + '-' + format[0];
  time[i][1] = time[i][1].replace(' hrs', '');
}


  var obj = {};
  for(let i = 0; i < time.length; i++)
  {
    obj['' + time[i][0] + ''] = time[i][1];
  }

  if (username != "")
  {
    json = {
      ss: '2034331',
      auth_user: username,
      "account_information": info,
      //dates: dates,
      "day": obj
    };
  } else {
    json = {"error": "Invalid Usage"};
  }

  res.send(json);
  username = "";
  password = "";
  //console.log(dates);
}

ytm();
} else {
  json = {"error": "Invalid Usage"};
  res.send(json);
}
});
app.listen(8080, function(){
    console.log(`Server running on ${port}`);
})

module.exports = app;
