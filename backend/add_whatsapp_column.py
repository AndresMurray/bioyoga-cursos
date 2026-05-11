import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/centra_db")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE home_configs ADD COLUMN whatsapp_number VARCHAR NOT NULL DEFAULT '5491112345678';"))
        print("Column 'whatsapp_number' added successfully.")
    except Exception as e:
        print("Error adding 'whatsapp_number' (maybe it already exists):", e)
    
    conn.commit()
