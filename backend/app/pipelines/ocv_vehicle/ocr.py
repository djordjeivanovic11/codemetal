import easyocr

class LicensePlateRecognizer:
    def __init__(self, languages=['en']):
        self.reader = easyocr.Reader(languages)
    
    def recognize(self, image):
        """
        Recognize text from the provided image.
        Returns the first detected text or 'N/A' if none found.
        """
        results = self.reader.readtext(image)
        if results:
            return results[0][1]
        return "N/A"
