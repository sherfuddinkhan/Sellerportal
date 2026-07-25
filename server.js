import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();


app.use(cors());
app.use(express.json());



// =====================================
// Axios API Client (replacement of api.js)
// =====================================

const api = axios.create({

    baseURL: "https://localhost:7122/api",

    headers: {
        "Content-Type": "application/json"
    }

});



// =====================================
// Request Interceptor
// =====================================

api.interceptors.request.use(

    (config) => {


        // Get token from incoming React request

        if(config.headers.authorization)
        {
            config.headers.Authorization =
            config.headers.authorization;
        }


        return config;

    },


    (error)=>{

        return Promise.reject(error);

    }

);



// =====================================
// Response Interceptor
// =====================================

api.interceptors.response.use(

    (response)=>{

        return response;

    },


    (error)=>{


        if(error.response?.status === 401)
        {
            console.log("Unauthorized API Request");
        }


        return Promise.reject(error);

    }

);




// =====================================
// AUTH REGISTER API
// =====================================

app.post("/api/auth/register", async(req,res)=>{


    try{


        const response = await api.post(

            "/Auth/register",

            req.body

        );


        res.json(response.data);


    }
    catch(error){


        res.status(

            error.response?.status || 500

        )
        .json({

            message:
            error.response?.data ||
            error.message

        });


    }


});





// =====================================
// AUTH LOGIN API
// =====================================

app.post("/api/auth/login", async(req,res)=>{


    try{


        const response = await api.post(

            "/Auth/login",

            req.body

        );


        res.json(response.data);


    }
    catch(error){


        res.status(

            error.response?.status || 500

        )
        .json({

            message:
            error.response?.data ||
            error.message

        });


    }


});





// =====================================
// SERVER START
// =====================================

app.listen(5000,()=>{

    console.log(
        "Node API Server running on port 5000"
    );

});