from time import sleep
import time
import serial
import eel
import json

DEV = '/dev/ttyACM0'

def worker():
    with serial.Serial(DEV, 9600, timeout=1) as ser:
        time_ = time.time()
        DATA_0 = {}
        DATA_1 = {}
        position = 0
        while(5 > time.time() - time_):
            raw = ser.read(size=4)
            if raw:
                sensor_0h,sensor_0l,sensor_1h,sensor_1l = raw

                DATA_0[position] = sensor_0h * 256 + sensor_0l
                DATA_1[position] = sensor_1h * 256 + sensor_1l
                position+=1
    return (json.dumps(DATA_0),json.dumps(DATA_1))


if __name__ == "__main__":
    print(worker())