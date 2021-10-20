from time import sleep
import time
import serial
import eel
import json

DEV = '/dev/ttyACM0'
DATA = {}

def setup():
    eel.init('src')
    eel.start('index.html')
    # open our serial port at 9600 baud
    
# pkg_size is the minimum time, should never be 0
@eel.expose
def worker(pkg_size):
    # Avoid reading strings or values less than 0
    if type(pkg_size) == int and pkg_size > 0: 
        with serial.Serial(DEV, 9600, timeout=1) as ser:
        
            time_ = time.time()
            position = 0
            DATA = {}
            while (pkg_size > time.time() - time_):
                raw = ser.read(size=2)
            
                if raw:
                    try:
                        # read the high and low byte
                        high, low = raw
            
                        # add up our bits from high and low byte
                        # to get the final value
                        DATA[position] = high * 256 + low
                        position+=1
                    except:
                        pass
            return json.dumps(DATA)
    else:
        print("Error while reading values...",pkg_size)
        return json.dumps({0 : 0})

if __name__ == "__main__":
    setup()
    #run()

