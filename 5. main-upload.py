# pip install python-multipart
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
import shutil
app = FastAPI()
upload_folder = "C:\Aribabo\KDT\FastAPI"
# @app.post("/files")
# async def create_file(file: bytes = File()):
#     return {'file_size': len(file)}
@app.post("/files")
async def create_file(file: bytes | None = File(default=None)):
    if not file:
        return {"message": "파일이 존재하지 않음"}
    return {'file_size': len(file)}
# File()를 따로 생성할 필요가 없음
# 만약 파일의 크기가 메모리 사이즈 이상을 넘어가면 디스크에 저장
# 이미지, 비디오, 큰 바이너리 파일 등과 같은 파일에 적합
# 메타데이터 정보도 해당 구문으로 통해 얻을 수 있음
@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(upload_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return JSONResponse(content={"message": "파일 업로드 성공", "filename": file.filename})