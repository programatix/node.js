import { Router, Request, Response } from 'express';

const router = Router();

router.get('/server', async (req: Request, res: Response) => {
    res.write(`
        <html>
        <body>
      `);
    res.write("Hello there, ");
    const date = new Date();
    if (date.getSeconds() % 2) {
        res.write("Ali");
    } else {
        res.write("Baba");
    }

    const fetchRes = await fetch("https://zenquotes.io/api/quotes");
    const quotes = await fetchRes.json();
    quotes.forEach((quote: any) => {
        res.write(quote.h);
    });

    res.write(`
        </body>
        </html>
      `);
    res.end();
});

router.get("/client", async (req: Request, res: Response) => {
    res.write(`
      <html>
      <body>
    `);
    res.write("Hello there, ");
    const date = new Date();
    if (date.getSeconds() % 2) {
        res.write("Ali");
    } else {
        res.write("Baba");
    }

    res.write(`
      <button onclick="getQuoteAsync()">Get quote</button>
      <div id="message"></div>
    `  );

    res.write(`
      <script>
        async function getQuoteAsync() {
          const fetchRes = await fetch("https://type.fit/api/quotes");
          const quotes = await fetchRes.json();
  
          let text = "";
          quotes.forEach((quote)=>{
            text += "<blockquote>&ldquo;"+quote.text+"&rdquo; &mdash; <footer>" + quote.author + "</footer></blockquote>"
          })
  
          const element = document.querySelector("[id='message']");
          element.innerHTML = text;
        }
      </script>
    `);

    res.write(`
      </body>
      </html>
    `);
    res.end();
});

export default router;