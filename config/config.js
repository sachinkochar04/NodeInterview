
let database={
        "connectionString":'mongodb://localhost/'    }
let auth= {
    secret: 'omnamahshivay',
    session_secret: "Startup_Secret_key"
}


let data = {
  database, auth
}

export default data
