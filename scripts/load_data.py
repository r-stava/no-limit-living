import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['nll-database']

# Load Cost of Living Data
cost_of_living_df = pd.read_excel('C:/Users/PNW_checkout/no-limit-living/data/cost_of_living.xlsx')
cost_of_living_records = cost_of_living_df.to_dict(orient='records')
db.cost_of_living.insert_many(cost_of_living_records)

# Load Crime Data (RateByType Sheet)
crime_data_type_df = pd.read_excel('C:/Users/PNW_checkout/no-limit-living/data/crime_data.xlsx', sheet_name='RateByType')
crime_data_type_records = crime_data_type_df.to_dict(orient='records')
db.crime_data_type.insert_many(crime_data_type_records)

# Load Crime Data (RateByYear Sheet)
crime_data_year_df = pd.read_excel('C:/Users/PNW_checkout/no-limit-living/data/crime_data.xlsx', sheet_name='RateByYear')
# Convert column names to strings
crime_data_year_df.columns = [str(col) for col in crime_data_year_df.columns]
crime_data_year_records = crime_data_year_df.to_dict(orient='records')
db.crime_data_year.insert_many(crime_data_year_records)
print("Data loaded successfully")
