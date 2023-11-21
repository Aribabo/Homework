from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
app = FastAPI()
templates = Jinja2Templates(directory="templates")
@app.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})
@app.post("/login", response_class=HTMLResponse)
async def login(request: Request, userid: str = Form(...), userpw: str = Form(...)):
    return templates.TemplateResponse("info.html", {"request": request, "userid": userid, "userpw": userpw})