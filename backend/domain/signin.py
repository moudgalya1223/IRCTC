import logging
from uuid import uuid4

from fastapi import HTTPException

from infrastructure import dbconnection1
from abc import ABC
from abc import abstractmethod


logger = logging.getLogger(__name__)


class Customsignin(ABC):
    @abstractmethod
    def customsignin(self, username, password):
        pass

class irctccustomsignin(Customsignin):
    def customsignin(self, username, password):
        if username and password:
            database = dbconnection1.firebasedb().connection_open()
            for document in database.collection("users").stream():
                user = document.to_dict()
                if (
                    user.get("password") == password
                    and (
                        user.get("username") == username
                        or user.get("email") == username
                    )
                ):
                    user_uuid = user.get("uuid")
                    if not user_uuid:
                        user_uuid = str(uuid4())
                        document.reference.set({"uuid": user_uuid}, merge=True)
                    logger.info("Successful login for user identifier %s", username)
                    return user_uuid

            raise HTTPException(
                status_code=401,
                detail="Unauthorized user",
            )

        raise HTTPException(
            status_code=401,
            detail="Username and password are required",
        )
