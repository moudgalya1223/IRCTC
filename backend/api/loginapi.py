import logging

from core.security.jwt import create_access_token
from core.shared.cors import configure_cors
from domain.signin import irctccustomsignin
from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()
configure_cors(app)
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

