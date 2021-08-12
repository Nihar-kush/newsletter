const express= require("express");
const bodyParser= require("body-parser");
const app= express();
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server init(3000)");
    });

//Using body-parser
app.use(express.urlencoded({extended:true}));

//The public folder which holds the CSS
app.use(express.static("public"));

//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

//Setting up MailChimp
mailchimp.setConfig({
    apiKey: "0c9911b54a7cd7debf181e731769a7eb-us5",
    server: "us5"
    });

//As soon as the sign in button is pressed execute this
app.post("/",(req,res)=>{
    const firstName= req.body.firstname;
    const lastName= req.body.lastname;
    const eMail= req.body.email;

//Add a contact to an audience
    const listId = "dd0d6d5496";
    const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: eMail
    };
    
//Uploading the data to the server
    async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
    FNAME: subscribingUser.firstName,
    LNAME: subscribingUser.lastName
    }  
    })

//If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html")
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.  `);
    }

//Running the function and catching the errors (if any)
    run().catch(e => {
        res.sendFile(__dirname + "/failure.html");
        console.log(e);
    });
    });   


// 0c9911b54a7cd7debf181e731769a7eb-us5
// dd0d6d5496





