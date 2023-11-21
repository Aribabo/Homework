from fastapi import FastAPI
from pydantic import BaseModel # 파이썬에서 제공하는 간결한 클래스생성 라이브러리
from typing import Optional
users = {
    0:{"userid" : "apple","name" : "김사과"},
    1:{"userid" : "banana","name" : "반하나"},
    2:{"userid" : "orange","name" : "오렌지"}
}

app = FastAPI()

# http://127.0.0.1:8000/users/0
# http://127.0.0.1:8000/docs
# uvicorn 파일이름:실행할거 --reload
# uvicorn main:app --reload
# 어캐보면 얘가 라우터 역할을 해줌
# 딕셔너리를 자동으로 json으로 변환해서 리턴해줌
@app.get("/users/{id}")
def find_user(id:int):
    user = users[id]
    return user # 딕셔너리였는데 리턴할때는 json화 된 상태

@app.get("/users/{id}/{key}")
def find_user_by_key(id:int,key:str):
    user = users[id][key]
    return user

# http://127.0.0.1:8000/id-by-name?name=김사과
@app.get("/id-by-name") #이렇게 받으면 쿼리스트링으로 받는다는 의미
def find_user_by_name(name:str):
    for idx, user in users.items():
        if user['name'] == name:
            return user
    return {'error':'데이터를 찾지 못함'}

# basemodel을 상속받아서 속성생성
class User(BaseModel):
    userid: str
    name: str 

# json 모양으로 받아서 파이썬의 클래스 형식으로 전환
@app.post("/users/{id}")
def create_user(id:int, user:User):
    if id in users:
        return {'error':'이미 존재하는 키'}
    users[id] = user.__dict__ # 객체로 받은값을 딕셔너리로 변환
    return {"success" : "ok"}

class UserForUpdate(BaseModel):
    userid: Optional[str] #해당 타입과 none 모두 허용
    name: Optional[str]

@app.put("/users/{id}")
def update_user(id:int,user:UserForUpdate):
    if id not in users:
        return {"error":"id가 존재하지 않음"}
    if user.userid:
        users[id]['userid'] = user.userid
    if user.name:
        users[id]['name'] = user.name
    return {'success':'ok'}

@app.delete('/users/{id}')
def delete_item(id:int):
    users.pop(id)
    return {'success' : 'ok'}
