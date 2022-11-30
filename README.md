# Global Details
I have taken course *Network Structure & Cloud Computing* in Fall 2022.

More details will be added as course progresses.

# Perquisite
1. Install NPM  & NodeJS on your local machine.
2. You can check by running below commands.
   ````
   npm -v
   ````
   ````
   node -v
   ````
# Build and Run
1. Clone the github repository on your local machine.
2. You need to install Postgres database to run the application.

   [POSTGRES LINK](https://www.postgresql.org/download/)
3. After installing, you need to enter your connection details in index.js file inside Models folder.
4. Run the below command to install all the package.
    ````
   npm install
    ````
5. To Run the application, run below command.
   ````
   npm start
   ````
6. To run unit tests, run below command.
   ````
   npm test
   ````
# Assignment 1
|Date|09/29|
|-|-|

In this assignment we are building one simple node.js application which only has one GET API call, returns only status code of 200 or 500.

# Assignment 2
|Date|10/06|
|-|-|

In this assignment we are building secured and public urls to create, fetch, update user accounts. All the calls are giving proper HTTP response code.

# Assignment 3

# Assignment 4

# Assignment 5

# Assignment 6

# Assignment 7

# Assignment 8

# Assignment 9

Command to upload SSL certificate to Load Balancer to use.
````
 aws acm import-certificate --certificate fileb://Certificate.pem --certificate-chain fileb://CertificateChain.pem --private-key fileb://PrivateKey.pem 	
````