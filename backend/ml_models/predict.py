import sys
import json
import pickle
import spacy

nlp = spacy.load("en_core_web_sm")

# Category model
category_model = pickle.load(open("ml_models/complaint_model.pkl", "rb"))
category_vectorizer = pickle.load(open("ml_models/vectorizer.pkl", "rb"))

# Urgency model
urgency_model = pickle.load(open("ml_models/urgency_model.pkl", "rb"))
urgency_vectorizer = pickle.load(open("ml_models/urgency_vectorizer.pkl", "rb"))

text = sys.argv[1]

doc = nlp(text.lower())

cleaned = " ".join([t.text for t in doc if not t.is_stop and t.is_alpha])

# Category prediction
cat_vec = category_vectorizer.transform([cleaned])
category_prediction = category_model.predict(cat_vec)[0]

# Urgency prediction
urg_vec = urgency_vectorizer.transform([cleaned])
urgency_prediction = urgency_model.predict(urg_vec)[0]

result = {
    "category": category_prediction,
    "urgency": urgency_prediction
}

print(json.dumps(result))