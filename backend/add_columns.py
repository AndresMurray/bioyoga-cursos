import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/centra_db")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE courses ADD COLUMN price INTEGER NOT NULL DEFAULT 0;"))
        print("Column 'price' added successfully.")
    except Exception as e:
        print("Error adding 'price' (maybe it already exists):", e)
        
    try:
        conn.execute(text("ALTER TABLE courses ADD COLUMN discount_percentage INTEGER NOT NULL DEFAULT 0;"))
        print("Column 'discount_percentage' added successfully.")
    except Exception as e:
        print("Error adding 'discount_percentage' (maybe it already exists):", e)
    
    conn.commit()
