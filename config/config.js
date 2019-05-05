
let database={
        "connectionString":'mongodb://localhost:27017/'    }
let auth= {
    secret: 'omnamahshivay',
    session_secret: "Startup_Secret_key"
}


let data = {
  database, auth
}

export default data
