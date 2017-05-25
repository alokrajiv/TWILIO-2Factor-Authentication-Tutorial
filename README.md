# Twilio 2Factor Auth Example

Node.js example for registration and login. Strong password hashing with the help of BCRYPT as well as 2 Factor Authentication using OneTouch or SoftToken of Twilio Authy, which falls back to SMS if the Authy App is not present.
Front-end is a simple design using bootstrap and bootstrap validator for form field validations.

##### To compile, build and run the server on your own machine or server:

###### Prerequisites:

* MongoDB server is installed and the daemon/service is running on standard port.
* Build essentials for make. (Ex. in ubuntu run: `sudo apt-get install build-essential`)

###### Go to the desired folder on your system. Then on the console type:
&nbsp;

    git clone https://github.com/alokrajiv/TWILIO-2Factor-Authentication-Tutorial.git
    cd twilio_2fa_web_test/
    npm install gulp-cli -g
    npm install
    cp .env.json.sample .env.json

Now edit `.env.json` file. (Ex: `vi .env.json`).

Take care to **add your  Production Key from the Twilio Authy Console**. You also can change the port the server will run. The default is 3001.

Now simply run on the console:

    gulp serve
    
The gulp task `serve` is configured to do everything for you automatically, include building of the minimified code after babel transpiles all the source code from `server/` into the `dist/` folder.

Once gulp finishes the tasks, it will start the nodemon server and in your console you will see:

    SERVER Express server listening on port 3001 +0ms

In your browser go to `http://localhost:3001` or whichever is the port you configured in the `.env.json` file. You will be able to start using the web-app.
