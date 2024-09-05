import sys
import pickle
import pandas as pd

# Load the trained model
model_path = 'C:/Users/PNW_checkout/no-limit-living/ml-model/model.pkl'
with open(model_path, 'rb') as file:
    model = pickle.load(file)

def predict_state(features):
    # Define the feature names as per the model's training data
    feature_names = ['Cost of Living', 'Violent', 'Homicide', 'Rape', 'Robbery', 'Assault']
    features_df = pd.DataFrame([features], columns=feature_names)  # Create a DataFrame from the features
    return model.predict(features_df)[0]  # Return the predicted state

if __name__ == '__main__':
    # Get the features from the command line arguments and convert them to floats
    features = list(map(float, sys.argv[1:]))
    predicted_state = predict_state(features)
    print(predicted_state)
