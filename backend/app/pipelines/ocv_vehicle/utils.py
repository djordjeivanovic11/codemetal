import cv2
import numpy as np

def get_dominant_color(image, k=3):
    """
    Resize the image for faster processing and use k-means clustering 
    to compute the dominant color. Returns a tuple (R, G, B).
    """
    resized = cv2.resize(image, (100, 100))
    reshaped = resized.reshape((-1, 3))
    reshaped = np.float32(reshaped)
    
    # Define criteria for k-means and perform clustering
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, labels, centers = cv2.kmeans(reshaped, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    dominant = centers[np.argmax(np.bincount(labels.flatten()))]
    return tuple(map(int, dominant))

def draw_detection(frame, bbox, label, plate_text, color_str):
    """
    Draw bounding box and detection information on the frame.
    """
    x1, y1, x2, y2 = bbox
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    text = f"{label} | {plate_text} | {color_str}"
    cv2.putText(frame, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)