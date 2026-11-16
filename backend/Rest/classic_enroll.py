from fastapi import HTTPException
from pydantic import BaseModel

from domain.register import directRegistartion


registration_service = directRegistartion()


class classicRegistration(BaseModel):
    username: str
    password: str
    mobilenumber: str | None = None
    document_As_per_document: str
    email: str
    id_token: str | None = None


def process_classic_enrollment(payload: classicRegistration) -> dict[str, str]:
    if bool(payload.id_token) != bool(payload.mobilenumber):
        raise HTTPException(
            status_code=400,
            detail="Mobile number and Firebase ID token must be provided together.",
        )

    phone_confirmed = (
        registration_service.phone_confimation(
            payload.id_token,
            payload.mobilenumber,
        )
        if payload.id_token and payload.mobilenumber
        else True
    )
    name_confirmed = registration_service.name_as_per_document(
        payload.document_As_per_document,
    )
    registration_service.registration_with_details(
        payload.username,
        payload.password,
        phone_confirmed,
        name_confirmed,
    )
    user_uuid = registration_service.register_user(
        payload.username,
        payload.password,
        payload.email,
        payload.document_As_per_document,
        payload.mobilenumber,
    )
    return {
        "message": "Registration completed successfully",
        "uuid": user_uuid,
    }
