import logging

from core.security.jwt import create_access_token
from domain.signin import irctccustomsignin
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
	allow_credentials=False,
	allow_methods=["POST"],
	allow_headers=["Content-Type"],
)
signin_service = irctccustomsignin()
logger = logging.getLogger(__name__)


class LoginRequest(BaseModel):
	username: str
	password: str


@app.post("/getlogindetails")
async def getlogindetails(login: LoginRequest):
	try:
		user_uuid = signin_service.customsignin(login.username, login.password)
	except ConnectionError:
		logger.exception("Unable to connect while authenticating user")
		return {"message": "Something went wrong"}

	access_token = create_access_token(str(user_uuid))
	return {
		"uuid": user_uuid,
		"access_token": access_token,
		"token_type": "bearer",
		"message": "Authorised personnel",
	}

