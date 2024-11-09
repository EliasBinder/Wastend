from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import io
from PIL import Image
from flask import Flask, request, jsonify
from tensorflow.keras.applications import MobileNetV3Large
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input, decode_predictions

app = Flask(__name__)

# Load your model
model = load_model('model.h5')
mobilenet_model = MobileNetV3Large(weights='imagenet')

def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    image = Image.open(io.BytesIO(file.read()))
    prepared_image = prepare_image(image, target_size=(224, 224))

    # Make prediction
    preds = model.predict(prepared_image)
    # ['metal', 'paper', 'trash', 'cardboard', 'plastic' ,'white-glass', 'brown-glass', 'green-glass', 'biological']
    preds = preds[0]

    if all(p < 0.9 for p in preds):
        mobilenet_preds = mobilenet_model.predict(prepared_image)
        decoded_preds = decode_predictions(mobilenet_preds, top=1)[0]
        print(decoded_preds)
        most_center_element = decoded_preds[0][1]
        return jsonify({"item": most_center_element})
    
    # Get the index with the maximum probability, and get the class name
    class_idx = np.argmax(preds)
    class_name = ['metal', 'paper', 'trash', 'cardboard', 'plastic' ,'white_glass', 'brown_glass', 'green_glass', 'biological'][class_idx]
    return jsonify({"item": class_name, "probability": float(preds[class_idx])})

if __name__ == '__main__':
    app.run(debug=True)