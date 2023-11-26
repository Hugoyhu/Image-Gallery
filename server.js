const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
const db = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = db.createClient(supabaseUrl, supabaseKey);

async function fetchData () {
    const { data } = await supabase
        .from('images')
        .select()
        .order('Time', { ascending: false })

    console.log(data);

    row1 = ``;
    row2 = ``;
    row3 = ``;
    row4 = ``;

    counter = 1;

    for (i = 0; i < data.length; ++i) {
        optimizedLink = data[i].link.slice(0, 49) + "w_1200,f_auto/" + data[i].link.slice(49);

        htmlSnippet = `<a href=${data[i].link} target="_blank"><img src="${optimizedLink}" style="width:100%"></a><figcaption class="figure-caption text-center">
                ${data[i].Model}, ${data[i].Lens}
                <br>${data[i].Focal} at ${data[i].FNumber} at ${data[i].Exposure} at ISO ${data[i].ISO}
            </figcaption>`
        switch (counter) {
            case 1:
                row1 += htmlSnippet;
                counter++
                break;
            case 2:
                row2 += htmlSnippet;
                counter++
                break;
            case 3:
                row3 += htmlSnippet;
                counter = 1;
                break;
            // case 4:
            //     row4 += `<img src="${data[i].link}" style="width:100%"><figcaption class="figure-caption text-center">
            //             ${data[i].Model}, ${data[i].Lens}
            //             <br>${data[i].Focal} at ${data[i].FNumber} at ${data[i].Exposure} at ISO${data[i].ISO}
            //         </figcaption>`
            //     counter = 1;
            //     break;
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
    -ms-flex: 33.33%; /* IE10 */
    flex: 33.33%;
    max-width: 33.33%;
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
    <h1>Photo Gallery</h1>
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
    </div>

    </body>
    </html>
    `

    return htmlCode;
}

app.get('/', async (req, res) => {

    console.log("hello!")
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    html = await fetchData();

    res.end(html);
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;
