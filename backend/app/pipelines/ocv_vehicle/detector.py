from ultralytics import YOLO

class VehicleDetector:
    def __init__(self, model_path="yolov8n.pt", target_classes=["car", "truck", "bus"]):
        self.model = YOLO(model_path)
        self.target_classes = target_classes

    def detect(self, frame):
        """
        Detect vehicles in the provided frame using YOLO.
        Returns a list of detections (each a dict with bbox, confidence, and label).
        """
        results = self.model(frame)
        detections = []
        for result in results:
            for box in result.boxes.data:
                # Box data: [x1, y1, x2, y2, confidence, class_index]
                x1, y1, x2, y2, conf, cls = box.cpu().numpy().astype(int)
                label = self.model.names[cls]
                if label in self.target_classes:
                    detections.append({
                        "bbox": (x1, y1, x2, y2),
                        "confidence": conf,
                        "label": label
                    })
        return detections
