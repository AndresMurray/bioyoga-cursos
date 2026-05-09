from database.session import engine, Base
from models import home_config

try:
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
except Exception as e:
    print(f"Error: {e}")
