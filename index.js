import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config(); 

const app=express();
const yourBearerToken =process.env.SESSION_SECRET;
const port=3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const month = monthNames[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const formattedDateTime = `${month} ${date}, ${year}`;

    //use-less
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    const time = `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    
app.get("/",(req,res)=>{
        res.render("index.ejs",{
        desc: 'N/A',
        humidity:'N/A',
        speed:'N/A',
        apparent_temp:'N/A',
        feels_like:'N/A',
        temp_min: 'N/A',
        temp_max:'N/A',
        pressure:'N/A',
        visibility:'N/A',
        Cloudiness:'N/A',
        fulldesc:'N/A',
        date:formattedDateTime,
        
    })
})

app.post("/currentweather",async(req,res)=>{
    const place =req.body.place
    try{
        const sanjay=await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${place}&appid=${yourBearerToken}`)
    const lat=sanjay.data[0].lat;
    const lon=sanjay.data[0].lon;
    const resp=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${yourBearerToken}`)
    
    console.log("data: "+JSON.stringify(resp.data));
    const iconcode=resp.data.weather[0].icon;
    
    res.render("index.ejs",{
        desc:resp.data.weather[0].main,
        humidity:resp.data.main.humidity,
        speed:resp.data.wind.speed,
        apparent_temp:resp.data.main.temp,
        feels_like:resp.data.main.feels_like,
        temp_min:resp.data.main.temp_min,
        temp_max:resp.data.main.temp_max,
        pressure:resp.data.main.pressure,
        visibility:resp.data.visibility,
        Cloudiness:resp.data.clouds.all,
        fulldesc:resp.data.weather[0].description,
        date:formattedDateTime,
        iconcode})
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        res.render("index.ejs", {
            desc: 'N/A',
            humidity: 'N/A',
            speed: 'N/A',
            apparent_temp: 'N/A',
            feels_like: 'N/A',
            temp_min: 'N/A',
            temp_max: 'N/A',
            pressure: 'N/A',
            visibility: 'N/A',
            Cloudiness: 'N/A',
            fulldesc: 'No description available',
            date: 'N/A',
             // Default icon link
        });
    }
    

})


app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT||port,()=>{
    console.log(`${port} port server running`)
})