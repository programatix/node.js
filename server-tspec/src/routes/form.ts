import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../pages/form.html"));
});

router.get('/process_get', function (req: Request, res: Response) {
    // Prepare output in JSON format
    let response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

export default router;