const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = []


const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data
      //console.log(appdata)
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    let data = JSON.parse( dataString )

    var ageVal = 0
    var dob = data.dateofbirth
    //console.log(dob)
    var splitDob = dob.split("/")
    var month = splitDob[0]
    var day = splitDob[1]
    var year = splitDob[2]
    var today = new Date();
    if ((today.getMonth() + 1) > month) {
      ageVal =  today.getFullYear() - year
    }
    else if((today.getMonth() + 1) == month) {
      if(today.getDate() > day) {
        ageVal = today.getFullYear() - year
      }
      else if(today.getDate() < day) {
        ageVal = today.getFullYear() - year - 1
      }
      else{
        ageVal = today.getFullYear() - year
      }
    }
    else if((today.getMonth() + 1) < month){
      ageVal = today.getFullYear() - year - 1
    }

    data["age"] = ageVal

    appdata.push(data)

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end(JSON.stringify(data))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {
       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )
     }
     else{
       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )
     }
   })
}

server.listen( process.env.PORT || port )
