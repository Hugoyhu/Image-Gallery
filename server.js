const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
const db = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = db.createClient(supabaseUrl, supabaseKey);

function requireHTTPS(req, res, next) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.use(requireHTTPS);

// this code is COPIED from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array.
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function vertical (width, height) {
    if (width/height < 1) {
        return true;
    } else {
        return false;
    }
}

async function fetchData () {
    const { data } = await supabase
        .from('images')
        .select()
        .order('Time', { ascending: false })

    data = shuffle(data);
    
    row1 = ``;
    row2 = ``;
    row3 = ``;
    row4 = ``;

    counter = 1;

    vertical1 = false;
    vertical2 = false;
    vertical3 = false;
    vertical4 = false;

    for (i = 0; i < data.length; ++i) {
        optimizedLink = data[i].link.slice(0, 49) + "w_1200,f_auto/" + data[i].link.slice(49);

        thirdLine = ' '
        if (data[i].Description != '') {
            thirdLine = `<br>${data[i].Description}`
        }

        htmlSnippet = `<a href=${data[i].link} target="_blank"><img src="${optimizedLink}" style="width:100%"></a><figcaption class="figure-caption text-center">
                ${data[i].Model}, ${data[i].Lens}
                <br>${data[i].Focal} <span>&#183;</span> ${data[i].FNumber} <span>&#183;</span> ${data[i].Exposure}s <span>&#183;</span> ISO${data[i].ISO} ${thirdLine}
            </figcaption>`


        switch (counter) {
            case 1:
                if (vertical1 == true) {
                    // skip new image to even heights out
                    vertical1 = false;
                    row2 += htmlSnippet;
                    counter++;
                    break;
                }

                row1 += htmlSnippet;
                counter++;

                if (vertical(data[i].Width, data[i].Height)) {
                    vertical1 = true;
                }

                break;
            case 2:
                if (vertical2 == true) {
                    // skip new image to even heights out
                    vertical2 = false;
                    row3 += htmlSnippet;
                    counter++;
                    break;
                }

                row2 += htmlSnippet;
                counter++;

                if (vertical(data[i].Width, data[i].Height)) {
                    vertical2 = true;
                }

                break;
            case 3:
                if (vertical3 == true) {
                    // skip new image to even heights out
                    vertical3 = false;
                    row4 += htmlSnippet;
                    counter++;
                    break;
                }

                row3 += htmlSnippet;
                counter++;

                if (vertical(data[i].Width, data[i].Height)) {
                    vertical3 = true;
                }

                break;
            case 4:
                if (vertical4 == true) {
                    // skip new image to even heights out
                    vertical4 = false;
                    row1 += htmlSnippet;
                    counter = 1;
                    break;
                }

                row4 += htmlSnippet;
                counter = 1;

                if (vertical(data[i].Width, data[i].Height)) {
                    vertical4 = true;
                }

                break;
        }
    }

    htmlCode = `
    <!DOCTYPE html>
    <html>
    <style>
    * {
    box-sizing: border-box;
    }

    body {
    margin: 0;
    font-family: Arial;
    }

    .header {
    text-align: center;
    padding: 32px;
    }

    .row {
    display: -ms-flexbox; /* IE10 */
    display: flex;
    -ms-flex-wrap: wrap; /* IE10 */
    flex-wrap: wrap;
    padding: 0 4px;
    }

    figcaption {
        background-color: black;
        color: white;
        font-style: italic;
        padding: 2px;
        text-align: center;
    }
      

    .column {
    -ms-flex: 25%; /* IE10 */
    flex: 25%;
    max-width: 25%;
    padding: 0 4px;
    }

    .column img {
    margin-top: 8px;
    vertical-align: middle;
    width: 100%;
    }

    @media screen and (max-width: 1200px) {
    .column {
        -ms-flex: 50%;
        flex: 50%;
        max-width: 50%;
    }
    }

    @media screen and (max-width: 800px) {
    .column {
        -ms-flex: 100%;
        flex: 100%;
        max-width: 100%;
    }
    }
    </style>
    <body>

    <div class="header">
    <h1>HUGO HU</h1>
    <p><a href="https://www.hugohu.me">https://www.hugohu.me</a></p>
    </div>

    <div class="row"> 
    <div class="column">
        ${row1}
    </div>
    <div class="column">
        ${row2}
    </div>  
    <div class="column">
        ${row3}
    </div>
    <div class="column">
        ${row4}
    </div>
    </div>

    </body>
    </html>
    `

    return htmlCode;
}

app.get('/', async (req, res) => {

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    html = await fetchData();

    res.end(html);
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;
