import express from "express";
import hbs from "hbs";
import path from "path";
import {fileURLToPath} from 'url';
import cors from "cors";
import bodyParser from "body-parser";

// to allow __dirname to work in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.set("view engine", "hbs")
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.get('/', (req, res)=> {
    res.redirect('/show-waifu')
})

app.get('/show-waifu', (req, res)=> {

    const apiUrl = 'https://api.waifu.im/search';  // Replace with the actual API endpoint URL
    const params = {
        included_tags: 'waifu',
        height: '>=2000'
    };
    
    const queryParams = new URLSearchParams(params);
    const requestUrl = `${apiUrl}?${queryParams}`;
    
    fetch(requestUrl)
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Request failed with status code: ' + response.status);
        }
        })
        .then(data => {
            const waifuInformation = data.images[0]
            if (waifuInformation.artist == null) {
                const waifuData = {
                    url: waifuInformation.url,
                    tags: waifuInformation.tags,
                    artist: {
                        name: "unknown"
                    }
                }
                return res.render('index', waifuData)
            }
            else {
                const waifuData = {
                    url: waifuInformation.url,
                    tags: waifuInformation.tags,
                    artist: waifuInformation.artist
                }
                return res.render('index', waifuData)
            }
        })
        .catch(error => {
            console.error('An error occurred:', error.message);
        });
    

})

app.listen(3000, ()=> {
    console.log("connected successfully");
});
