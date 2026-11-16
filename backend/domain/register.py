import re
from uuid import uuid4

from fastapi import HTTPException
from firebase_admin import auth

from infrastructure import dbconnection1


PASSWORD_PATTERN = re.compile(
    r"(?=.{11,15}\Z)"
    r"(?=.*[a-z])"
    r"(?=.*[A-Z])"
    r"(?=.*\d)"
    r"(?=.*[^A-Za-z0-9\s])"
    r"(?!.*(.)\1\1)"
    r"(?!.*(?i:012|123|234|345|456|567|678|789|"
    r"987|876|765|654|543|432|321|210|abc|bcd|cde|def|efg|"
    r"fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|"
    r"stu|tuv|uvw|vwx|wxy|xyz))"
    r"\S+"
)


class directRegistartion:
    def phone_confimation(self, id_token: str, phonenumber: str) -> bool:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token.get("phone_number") == phonenumber

    def name_as_per_document(self, docname: str) -> bool:
        if 0 < len(docname.strip()) <= 110:
            return True

        return False

    def registration_with_details(
        self,
        username: str,
        password: str,
        phone_confirmed: bool,
        name_confirmed: bool,
    ) -> bool:
        if (
            len(username) < 100
            and PASSWORD_PATTERN.fullmatch(password) is not None
            and phone_confirmed
            and name_confirmed
        ):
            return True

        raise HTTPException(
            status_code=400,
            detail=(
                "Username must be fewer than 100 characters. Password must be "
                "11-15 characters with uppercase, lowercase, digit, and "
                "special character, without repeated or sequential characters."
            ),
        )

    def register_user(
        self,
        username: str,
        password: str,
        email: str,
        document_name: str,
        mobile_number: str | None,
    ) -> str:
        database = dbconnection1.firebasedb().connection_open()
        users = database.collection("users")

        if self._user_exists(users, "username", username):
            raise HTTPException(status_code=409, detail="Username is already registered.")
        if self._user_exists(users, "email", email):
            raise HTTPException(status_code=409, detail="Email is already registered.")
        if mobile_number and self._user_exists(users, "mobile number", mobile_number):
            raise HTTPException(
                status_code=409,
                detail="Mobile number is already registered.",
            )

        user_uuid = str(uuid4())
        user_data = {
            "uuid": user_uuid,
            "username": username,
            "password": password,
            "email": email,
            "name_as_per_document": document_name,
        }
        if mobile_number:
            user_data["mobile number"] = mobile_number

        users.document(user_uuid).set(user_data)
        return user_uuid

    @staticmethod
    def _user_exists(users, field: str, value: str) -> bool:
        return next(users.where(field, "==", value).limit(1).stream(), None) is not None

   