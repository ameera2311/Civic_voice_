import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

data = {
    "complaint": [
        "water pipe burst and flooding",
        "electric pole spark",
        "garbage not collected",
        "small pothole on road",
        "major road accident risk",
        "street light not working"
    ],
    "urgency": [
        "High",
        "High",
        "Medium",
        "Normal",
        "High",
        "Medium"
    ]
}

df = pd.DataFrame(data)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["complaint"])

y = df["urgency"]

model = LogisticRegression()
model.fit(X,y)

pickle.dump(model,open("urgency_model.pkl","wb"))
pickle.dump(vectorizer,open("urgency_vectorizer.pkl","wb"))

print("Urgency model saved")