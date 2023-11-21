from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()
templates = Jinja2Templates(directory="templates") # 폴더연결

# /static은 내가 생성하는 접근할 수 있는 주소를 생성, http://127.0.0.1:8000/static/style.css하면 css에 접근가능, 보안에 좋다
# 폴더는 static에서 찾고 html에 전달하는 이름은 static이다
app.mount("/static",StaticFiles(directory='static'),name='static')

@app.get("/")
async def read_root(request: Request):
    data = {"name":"김사과","title":"김사과홈페이지"}
    return templates.TemplateResponse("index.html",{"request" : request, "data":data})
    #비동기함수는항상페이지를리턴해줘야함

