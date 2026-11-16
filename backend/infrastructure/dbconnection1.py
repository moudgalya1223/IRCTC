import logging
from core.utils import dbconnectionsettings
from abc import ABC, abstractmethod
class authenticationdb(ABC):
     @abstractmethod
     def connection_open(self):
            pass
     @abstractmethod
     def connection_close(self):
            pass

class firebasedb(authenticationdb):
    def connection_open(self):
        self.db = dbconnectionsettings.firebase_database.db
        logging.info("Firestore connection opened successfully")
        return self.db

    def connection_close(self):
        self.db.close()
        logging.info("Firestore connection closed successfully")