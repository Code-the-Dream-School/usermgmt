# Node/Express Tutorial for Sending Mail, User Management
In previous lessons, you learned how to register users, storing hashed
passwords, and enabling logon with the hashed password and JWT token.
However, there was no way to validate the email the user used to register.
Also, there was no way for the user to reset their password if they
forget it.  
  
In this lesson, you will use Sendgrid to send email to the user when
that user registers.  Logon will be disabled until the user validates
the email via a link in the email.  The user will also be able to reset
their password by requesting an email with a reset password link. 
 
# Sendgrid 
 
In a previous lesson, you established a MongoDB internet account so that
you could store information in MongoDB.  For this lesson, you need
to establish, first, a sender email account, and second, a free Sendgrid
account.  The sender email account will be used as the from address for
the emails your Node program sends.  Do NOT use your regular email account.
This is because the sender email account might be flagged as the origin
of spam, in which case you could no longer use it for regular email. You
can create a new free email address using Gmail or Protonmail or Yahoo mail. 
 
After you create the Sendgrid account at sendgrid.com, you need to configure
some settings.  Under the settings tab on the left side of the screen, you
see a link for tracking.  Click on that link and make sure all tracking is
configured as disabled.  You do not want tracking for this lesson. Next,
click on sender authentication.  This is where you verify the sender address
you created in the previous account.  Again, do not use your regular email
address.  When you request sender authentication, an email is sent to the
email account you created.  You click on that email to complete authentication.
Finally, click on API Keys.  You then create an API key for Sendgrid.  Copy
the API key and save it.  BE VERY CAREFUL with this API key.  Do NOT store
it in any file that might get pushed to Github.  Do NOT put it in the code,
even temporarily. 
 
## .env File 
 
Next, you need to create a .env file.  This is where you put your MongoURI,
your Sendgrid API key, and other settings.  Be sure that this is in the
usermgmt base directory.  If you put it in a different directory, it won't
work and it could be sent to Github.  Your env file will look something like:

```
MONGO_URI=mongodb+srv://<username:password>@cluster0.xqmn4.mongodb.net/usermgmt?retryWrites=true&w=majority
SENDGRID_API_KEY=<your sendgrid api key>
JWT_LIFETIME=24h
ONE_TIME_TOKEN_LIFETIME=6h
JWT_SECRET=<some long complicated string>
FROM_ADDRESS=<your from email address>
```
 
You will substitute for each of the values in < >.  Don't include the <> characters.
The FROM_EMAIL address is the sender address you established in step 1, not
your regular email address.  Your Mongo URI may be different from the one above.
This .env file is not pushed to github because it is listed in the .gitignore file.
 
## Setting up Postman Testing 
 
Iin the routes/auth.js file are a bunch of routes.  You need to create a Postman
request for each of the routes, so that you can test each of them with Postman.
For each of the post and put routes, you need to pass a JSON document in the
body of the request, as follows: 
 
- /register: email, password
- /login: email, password
- /resetPassword: email, password
- /changePassword: email, password
- /getOneTimeToken: email, password
- /requestPasswordResetPrompt: email
- /sendEmailValidatePrompt: email
- /sendEmailValidateLink: email, password
- /sendPasswordResetLink: email, password 
 
In addition, many operations require that the authorization header
contains a Bearer token.  You can tell by looking at routes/auth.js.
If the auth middleware is specified, that route requires a normal JWT
token, as would be returned by a post to /login.  If the
authOneTimeToken middleware is specified, that route requires a
one time token, as would be sent by getOneTimeToken.  The
getOneTimeToken, sendEmailValidateLink, and sendPasswordResetLink
routes are just for testing. 
 
## Typical Flow

What is supposed to happen is this (and this is implemented in the
front end and the front end calls to the back end).  The user registers.
Then an email to validate the user's email is sent to the user's email
address.  The email that is sent contains a link with a one time token in
the URL.  If the user clicks on that link, the email is validated. Then
the user can logon.  After logon, the user can test the connection,
change their password, or logoff.  If the user forgets their password,
the logon page has a link to cause an email to be sent to them.  That
email has a one time token in the URL, and brings up a page that allows
password reset.

We can't fully test this, because we can't put the link in the email.
Since you are running the server on your local machine, the URL must
be for http, not https.  Email systems recognize this as a dangerous
link, and disable access.  So if you look at email/sender.js, you
will see that the code to actually send the link is commented out.

You can see what URL would actually be in the email link by
doing the sendEmailValidateLink and sendPasswordResetLink requests
via Postman.  If you copy the link that is sent into your browser,
you will see how it works. 
 
However the code does actually send the emails.  For various reasons,
these emails typically end up in the spam folder, so you have to
look for them there. 
 
##  Code You Must Write

Do all your work in a git branch as usual, so that you can do
a pull request at the end to submit your homework.

You need to change controller/auth.js to make this work.  All the methods
are already implemented for you except login, sendPasswordResetPrompt,
and resetPassword.  
 
For login, you need to verify that a user with
the email is in the database and that the password matches.  Remember
that to verify the password you have to do the hashing.  You can use the
comparePassword method of the user model to do this.  You don't let
the user login if the email has not been validated, and you can
check that it has by checking the valid attribute of the user.  You
can throw a BadRequestError or an UnauthenticatedError if the
logon fails, depending on the reason for the failure.  If the logon
succeeds, you return from it as follows 
 
```
 const token = user.createJWT()
 const payload = jwt.decode(token)
 const expires = payload.exp
 res.status(StatusCodes.OK).json({ token, expires })
 ```

For sendPasswordResetPrompt, you need to send an email so that
the user can reset their password.  As we said before, you won't
actually put the link in the email, because you are running
as http, not https.  You can get an idea of how to do it by
looking at the sendEmailValidatePrompt method, and also the
sendPasswordResetLink method.  You use the createTokenURLReset
method and also the sendPasswordResetEmail method.

For resetPassword, you need to validate the inputs and change
the password if the inputs are valid, with appropriate error
messages if they are not.  The password must have at least 8
characters, with at least one upper case letter, at least one
lower case letter, and at least one special character.  The user
model has a regular expression to check this.  Use user.save(),
not user.updateOne(), because if you use updateOne, the password
will not be saved in hashed form.

The other file you have to change is email/sender.js.  You need
to complete the sendPasswordResetEmail method.  It will be
similar to the sendVerifyEmail method, but the subject and
body of the email will be about password reset, not password
verify.  Again, don't put the link in the email.

## Submitting Your Work

When you are done with the code changes, test everything.  First use
Postman to test each of the routes.  Remember that you will have
to set an appropriate Bearer token in the authorization header for
many of these.  Then test using the front end.  This is a crude
front end, with no styling.  While your server is running, you
go to localhost:3000 with your browser and you can try it out.
When you test the email functions, be sure that you receive the
email, but remember that it might end up in the spam folder.

Read the code in the ./public directory.  This is the html and
javascript that implements the front end.  Try to understand
what it does.  It communicates with the back end using REST calls
using the fetch API.  You have the skills to create
a similar (but better looking) front end because of what you
learned in the Intro to Programming class.

Then, when all is working, submit your work as usual. 
 
## A Note on Security
 
There are two kinds of tokens in this application.  The normal
JWT token is generated from logon.  But if we need to verify an
email address or reset a password, we can't use that token, because
then the user could access restricted operations without logon.
They'd get the token they need out of the email.  So, instead, we
create a special one time token.  We sign it with the user's hashed
password + the JWT secret.  That way, it can only be used by the
user with that email address and password.
 