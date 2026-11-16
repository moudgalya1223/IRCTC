from fastapi import FastAPI

from core.shared.cors import configure_cors
from Rest.classic_enroll import (
    classicRegistration,
    process_classic_enrollment,
)


app = FastAPI()
configure_cors(app)


@app.post("/classic-enroll")
async def classic_enroll(payload: classicRegistration) -> dict[str, str]:
    return process_classic_enrollment(payload)
