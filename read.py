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
            DATA_0 = {}
            DATA_1 = {}
            while (pkg_size > time.time() - time_):
                raw = ser.read(size=4)
            
                if raw:
                    try:
                        #Read high and low values for each raw 
                        sensor_0h,sensor_0l,sensor_1h,sensor_1l = raw

                        # Pack inside the DATA map
                        DATA_0[position] = sensor_0h * 256 + sensor_0l
                        DATA_1[position] = sensor_1h * 256 + sensor_1l
                        position+=1
                    except:
                        pass
            return (json.dumps(DATA_0),json.dumps(DATA_1))
    else:
        print("Error while reading values...",pkg_size)
        return json.dumps({0 : 0})

if __name__ == "__main__":
    setup()
    #run()

