const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
const db = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = db.createClient(supabaseUrl, supabaseKey);

const PostHog = require('posthog-node');

const PostHogClient = new PostHog.PostHog(
    process.env.POSTHOG,
    { host: 'https://us.posthog.com' }
)


// function requireHTTPS(req, res, next) {
//     if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
//       return res.redirect('https://' + req.get('host') + req.url);
//     }
//     next();
// }

// app.use(requireHTTPS);



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

async function fetchData (sortFilterFunc, input1) {
    var { data } = await supabase
        .from('images')
        .select()
        .order('Time', { ascending: false })

    data = sortFilterFunc(data, input1);

    row1 = ``;
    row2 = ``;

    counter = 1;

    vertical1 = false;
    vertical2 = false;

    for (i = 0; i < data.length; ++i) {
        console.log(counter);

        optimizedLink = data[i].link.slice(0, 49) + "w_1200,f_auto/" + data[i].link.slice(49);

        thirdLine = ' '
        if (data[i].Description != '') {
            thirdLine = `<br>${data[i].Description}`
        }

        htmlSnippet = `<a href=${data[i].link} target="_blank"><img src="${optimizedLink}" style="width:100%"></a><figcaption class="figure-caption text-center">
                ${data[i].Model}, ${data[i].Lens}
                <br>${data[i].Focal} <span>&#183;</span> ${data[i].FNumber} <span>&#183;</span> ${data[i].Exposure}s <span>&#183;</span> ISO${data[i].ISO} ${thirdLine}
                <br>${data[i].location} <span>&#183;</span> ${(new Date(data[i].Time)).toDateString()}
            </figcaption>`

        
        switch (counter) {
            case 1:
                
                if (vertical1 == true) {
                    // skip new image to even heights out
                    vertical1 = false;
                    row2 += htmlSnippet;
                    counter = 2;
                    break;
                }

                row1 += htmlSnippet;
                counter = 2;

                if (vertical(data[i].Width, data[i].Height)) {
                    vertical1 = true;
                }

                break;

            case 2:
                if (vertical2 == true) {
                    // skip new image to even heights out
                    vertical2 = false;
                    row1 += htmlSnippet;
                    counter = 1;
                    break;
                }

                row2 += htmlSnippet;
                counter = 1;

                if (vertical(data[i].Width, data[i].Height)) {
                    vertical2 = true;
                }


                break;
            case 3:
                // console.log(i);
                // console.log("?!")

                
        }
    }

    // console.log(row1);
    // console.log('\n\n\n\n\n\n');
    // console.log(row2);

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
    -ms-flex: 50%; /* IE10 */
    flex: 50%;
    max-width: 50%;
    padding: 0 4px;
    }

    .column img {
    margin-top: 8px;
    vertical-align: middle;
    width: 100%;
    }

    </style>
    <body>

    <div class="header">
    <h1>HUGO HU</h1>
    <p><a href="https://www.hugohu.me">https://www.hugohu.me</a></p>
    <p><a href="mailto: photography@hugohu.me">photography@hugohu.me</a></p>
    <p>These previews have been optimized to reduce the total amount of data loaded to your device. To see the full resolution image, click the image and it will show up in a new tab, full resolution!</p>

    <h3>Sort By:</h3>
    <a href="/">Time (Newest First)</a>&nbsp&nbsp
    <a href="/random">Random Order</a>


    <br>
    <br>
    <a href="/lens/EF24-70mm%20f%2F2.8L%20USM">EF24-70mm</a>&nbsp&nbsp
    <a href="/lens/EF24-70mm%20f%2F2.8L%20II%20USM">EF24-70mm II</a>&nbsp&nbsp
    
    <a href="/lens/EF16-35mm%20f%2F4L%20IS%20USM">EF16-35mm</a>&nbsp&nbsp

    <a href="/lens/EF100-300mm%20f%2F5.6">EF100-300mm</a>&nbsp&nbsp
    <a href="/lens/EF70-200mm%20f%2F2.8L%20IS%20III%20USM">EF70-200mm III</a>&nbsp&nbsp
    <a href="/lens/EF70-200mm%20f%2F2.8L%20IS%20III%20USM%20%2B1.4x%20III">EF70-200mm III + 1.4x III</a>&nbsp&nbsp

    <a href="/lens/RF15-35mm%20F2.8%20L%20IS%20USM">RF15-35mm</a>&nbsp&nbsp
    <a href="/lens/RF100mm%20F2.8%20L%20MACRO%20IS%20USM">RF100mm</a>&nbsp&nbsp
    <a href="/lens/RF100-500mm F4.5-7.1 L IS USM">RF100-500mm</a>


    <br>
    <br>

    <a href="/category/landscape">Landscape</a>&nbsp&nbsp
    <a href="/category/nature">Nature</a>&nbsp&nbsp
    <a href="/category/birds">Birds</a>&nbsp&nbsp
    <a href="/category/animals">Animals</a>&nbsp&nbsp
    <a href="/category/metropolitan">Metropolitan</a>&nbsp&nbsp
    <a href="/category/flowers">Flowers</a>&nbsp&nbsp
    <a href="/category/objects">Objects</a>&nbsp&nbsp
    <a href="/category/astrophotography">Astro</a>



    </div>

    <div class="row"> 
    <div class="column">
        ${row1}
    </div>
    <div class="column">
        ${row2}
    </div>  
    
    </div>

    </body>
    </html>
    `

    return htmlCode;
}


// @media screen and (max-width: 1200px) {
//     .column {
//         -ms-flex: 50%;
//         flex: 50%;
//         max-width: 50%;
//     }
//     }

//     @media screen and (max-width: 800px) {
//     .column {
//         -ms-flex: 100%;
//         flex: 100%;
//         max-width: 100%;
//     }
//     }

// <div class="column">
//         ${row3}
//     </div>
//     <div class="column">
//         ${row4}
//     </div>


function sendPostHog (event, IP) {
    PostHogClient.capture({
        distinctId: IP,
        event: event
    });

    PostHogClient.flush();
}

function doNone (data) {
    return data;
}

app.get('/', async (req, res) => {

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    sendPostHog("main", req.socket.remoteAddress);

    html = await fetchData(doNone, 0);

    res.end(html);
})


function random (data) {
    return shuffle(data);
}

app.get('/random', async (req, res) => {

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    sendPostHog("random", req.socket.remoteAddress);

    html = await fetchData(random, 0);

    res.end(html);
})



function sortLens (data, phrase) {
    tempData = [];

    for (i = 0; i < data.length; ++i) {
        if (data[i].Lens == decodeURIComponent(phrase)) {
            tempData.push(data[i]);
        }
    }

    return tempData;
}

app.get('/lens/*', async (req, res) => {

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    sendPostHog(decodeURIComponent(req.url.slice(6)), req.socket.remoteAddress);

    html = await fetchData(sortLens, decodeURIComponent(req.url.slice(6)));

    res.end(html);
})


function sortCategory (data, phrase) {
    tempData = [];

    for (i = 0; i < data.length; ++i) {
        if (data[i].Label == phrase) {
            tempData.push(data[i]);
        }
    }

    return tempData;
}

app.get('/category/:cat', async (req, res) => {

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    sendPostHog(req.params["cat"], req.socket.remoteAddress);

    html = await fetchData(sortCategory, req.params["cat"]);

    res.end(html);
})

  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;
