import strawberry

from infrastructure.dbconnection1 import firebasedb


@strawberry.type
class User:
    id: strawberry.ID
    username: str | None = None
    email: str | None = None


@strawberry.type
class Query:
    @strawberry.field
    def users(self) -> list[User]:
        database = firebasedb().connection_open()
        return [
            User(
                id=document.id,
                username=data.get("username"),
                email=data.get("email"),
            )
            for document in database.collection("users").stream()
            for data in [document.to_dict()]
        ]


schema = strawberry.Schema(query=Query)
