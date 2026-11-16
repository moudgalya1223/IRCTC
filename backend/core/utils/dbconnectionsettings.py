import os
from pathlib import Path

import firebase_admin
import requests
from dotenv import load_dotenv
from firebase_admin import credentials, firestore


load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class FirebaseDatabase:
    def __init__(self) -> None:
        cred = self._load_credentials()
        try:
            self.app = firebase_admin.get_app()
        except ValueError:
            self.app = firebase_admin.initialize_app(cred)
        self.db = firestore.client(self.app)

    @staticmethod
    def _load_credentials():
        credentials_file = (
            os.getenv("FIREBASE_CREDENTIALS_FILE")
            or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        )
        if credentials_file:
            path = Path(credentials_file).expanduser()
            if not path.is_file():
                raise RuntimeError(
                    f"Firebase credentials file does not exist: {path}"
                )
            return credentials.Certificate(str(path))

        credentials_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if credentials_json:
            try:
                return credentials.Certificate(
                    __import__("json").loads(credentials_json)
                )
            except ValueError as exc:
                raise RuntimeError(
                    "FIREBASE_CREDENTIALS_JSON must contain valid JSON."
                ) from exc

        s3_json_url = os.getenv("firestore_s3_presigned_url")
        if not s3_json_url:
            raise RuntimeError(
                "Configure FIREBASE_CREDENTIALS_FILE, "
                "GOOGLE_APPLICATION_CREDENTIALS, or FIREBASE_CREDENTIALS_JSON."
            )

        try:
            response = requests.get(s3_json_url, timeout=30)
            response.raise_for_status()
            return credentials.Certificate(response.json())
        except requests.HTTPError as exc:
            raise RuntimeError(
                "The Firebase credential S3 URL is expired or invalid. "
                "Refresh it or configure FIREBASE_CREDENTIALS_FILE instead."
            ) from exc


firebase_database = FirebaseDatabase()
