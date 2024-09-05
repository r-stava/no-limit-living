import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["nll-database"]

# Load data from the database
cost_of_living_data = pd.DataFrame(list(db["cost_of_living"].find()))
crime_data_type = pd.DataFrame(list(db["crime_data_type"].find()))

# Rename columns for easier merging
cost_of_living_data.rename(columns={"State": "state"}, inplace=True)
crime_data_type.rename(columns={"State": "state"}, inplace=True)

# Merge the datasets on the 'state' column
data = pd.merge(cost_of_living_data, crime_data_type, on='state')

# Create features and target
features = data[['Cost of Living', 'Violent', 'Homicide', 'Rape', 'Robbery', 'Assault']]
target = data['state']  # State is the target

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the trained model to a file
with open("C:/Users/PNW_checkout/no-limit-living/ml-model/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model training complete and saved to model.pkl")
