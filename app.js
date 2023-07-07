const express = require("express")
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing")
require('dotenv').config();
 
const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
 
app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/signup.html`)
})
 
mailchimp.setConfig({
  apiKey: process.env.KEY,/*<-----your api key*/
  server: "us21"/*<----Use your server prefix*/
})
 
app.post("/", function (req, res) {
  // console.log(req.body)
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const listId = "19644b4244" /*<---your list id*/
  console.log(firstName+lastName+email)
 
  const run = async () => {
    const response = await mailchimp.lists.batchListMembers(listId, {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    });
    console.log(response)
    res.send("<h1>success</h1>")
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }
 
  run().catch(e => res.send("<h1>faliure</h1>"));
})
 
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port 3000")
})