import jwt

SECRET = "qwerty"


def encode_data(data: dict) -> str:
    return jwt.encode(data, SECRET, algorithm='HS256')


def decode_data(jwt_token: str) -> dict:
    try:
        return jwt.decode(jwt_token, SECRET, algorithms=['HS256'])
    except jwt.exceptions.DecodeError:
        return {}
