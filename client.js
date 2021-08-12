const http = require('http')
const {
    createHash
} = require('crypto');

//setting up gloabal variables
const Badsec_server = "localhost"
const API_port = 8888
const hash = createHash('sha256')
let requestChecksum = ""
let Badsec_Auth_Token = ""
let req_options = {
    hostname: Badsec_server,
    port: API_port,
    method: 'GET'

}

let RETRY_COUNT = 1
const MAX_RETRIES = 3


//function to simulate request retries and exit after 3 tries
function retryRequest(err, options) {
    
    console.error(`Retry Attempt ${RETRY_COUNT}`,'\t',`Error:`,err.message)
    if (RETRY_COUNT === MAX_RETRIES) {
        console.error("Error: ", new Error("Maximum Attempts Reached").message)
        console.error("Exiting...")
        process.exit(1)
    }
    RETRY_COUNT++

    //make the rquest againt after 1 second
    setTimeout(() => {
        httpRequest(options)
    }, 1000)
}


//function to perform promise based http requests
async function httpRequest(options) {
   
    let http_request = new Promise(function (resolve, reject) {
      
        const request = http.request(options, res => {
            
            const resCode = res.statusCode
            //console.log(res)
            /* Retry request if response code is not 200 */
            if (resCode === 400 || resCode === 404) retryRequest(new Error("Bad API Request"), options)
            if (resCode === 401) retryRequest(new Error('Authentication Error'), options)
            if (resCode === 500) retryRequest(new Error('Internal Server Error'), options) 
            else if (resCode !== 200) retryRequest(new Error('Error making request'), options)
            
            
            resolve(res)
        })
        
        request.on('error', error => {
            //retry on conncetion error
            retryRequest(error, options)

        })
        request.end();
    }).catch(error => console.error(error.message))

    return http_request
}

/**Function to return auth token */
async function getAuthToken() {
    const auth_api_options= {
        ...req_options,
        path: '/auth'
    }
    const auth_response = await httpRequest(auth_api_options)
    return auth_response.headers['badsec-authentication-token']

}

async function getUsers(){
    Badsec_Auth_Token=await getAuthToken();
    let stringToHash=Badsec_Auth_Token+"/users"
    hash.update(stringToHash)
    requestChecksum=hash.digest('hex')
   
  
    // Set request headers
    let users_api_options={
        ...req_options,
        path:'/users',
        headers:{
        'Content-Type': 'application/json',
        'X-Request-Checksum':requestChecksum
        }
    }
    //declare string variable to store string response
    let userIDs=""

    
    const users_request=await httpRequest(users_api_options);
    users_request.setEncoding('utf8') //interpret the response stream as string
    users_request.on('data', user_id=> {
        userIDs+=user_id //add user_id string to users variable
       })

    users_request.on('end',()=>{
        userIDs=userIDs.split(/\r?\n/)  //split usersIDs string into an array of user id using newline as a separator
        console.log(userIDs)
        // console.log(JSON.stringify(watu))
        process.exit(0)

      })
    

      
}

getUsers();
