import threading
import time
import logging

from tpms_receiver import TPMSReceiver
from data_store import DataStore
from decision_engine import DecisionEngine

def setup_logging():
    logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

def tpms_callback(data):
    logging.info(f"Received TPMS data: {data}")
    data_store.add_record(data)

if __name__ == "__main__":
    setup_logging()

    data_store = DataStore()

    receiver = TPMSReceiver()

    receiver_thread = threading.Thread(target=receiver.run, args=(tpms_callback,), daemon=True)
    receiver_thread.start()

    decision_engine = DecisionEngine(data_store)

    try:
        while True:
            decision_engine.check_alerts()
            time.sleep(5)
    except KeyboardInterrupt:
        logging.info("Shutting down TPMS pipeline.")
