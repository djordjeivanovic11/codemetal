import cv2
import argparse
import logging
from detector import VehicleDetector
from ocr import LicensePlateRecognizer
from utils import get_dominant_color, draw_detection

def setup_logging():
    logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

def process_frame(frame, detector, ocr):
    """
    Process one video frame by:
      - Detecting vehicles with YOLO
      - Extracting the dominant color using k-means
      - Recognizing license plate text via OCR
      - Getting dummy car brand and size
      - Annotating the frame with the results
    Returns a list of enriched detection data and the processed frame.
    """
    detections = detector.detect(frame)
    enriched_data = []
    
    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        vehicle_roi = frame[y1:y2, x1:x2]
        
        color = get_dominant_color(vehicle_roi)
        color_str = f"RGB: {color}"
        plate_text = ocr.recognize(vehicle_roi)
        
        data = {
            "bbox": det["bbox"],
            "label": det["label"],
            "confidence": det["confidence"],
            "color": color_str,
            "license_plate": plate_text,
        }
        enriched_data.append(data)
        draw_detection(frame, det["bbox"], det["label"], plate_text, color_str)
    
    return enriched_data, frame

def main(source):
    setup_logging()
    logging.info("Initializing video capture...")
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        logging.error(f"Unable to open video source: {source}")
        return
    
    logging.info("Initializing vehicle detector and OCR engine...")
    detector = VehicleDetector()
    ocr = LicensePlateRecognizer()
    
    logging.info("Starting video processing pipeline...")
    while True:
        ret, frame = cap.read()
        if not ret:
            logging.info("End of video stream or error encountered.")
            break
        
        enriched_data, processed_frame = process_frame(frame, detector, ocr)
        logging.info(f"Enriched detections: {enriched_data}")
        
        cv2.imshow("Vehicle Detection & Data Enrichment", processed_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            logging.info("Quitting pipeline...")
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Vehicle Detection and Enrichment Pipeline")
    parser.add_argument("--source", type=str, default="video.mp4",
                        help="Video source (file path, webcam index, or URL)")
    args = parser.parse_args()
    main(args.source)
