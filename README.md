# Practica 4 SyA

> Este es el repositorio para la practica 4 de la materia de Sensores y Actuadores, la cual consiste de una interfaz grafica para la graficación/procesamiento de señales analogas. 

### Integrantes:
- Sebastian Tuyu
- Sergio Blanco
- Juan Carlos Montero

## Funcionamiento

- El script de python utiliza `pyserial` + `eel` + `arduinoIDE` para funcionar, los datos son expuestos
por arduino y leidos por python, para posteriormente ser renderizados en pantalla con eel que 
renderiza los datos a `html` + `css` + `js`


## Dónde comenzar
Requisitos de instalación
- [ArduinoIDE](https://www.arduino.cc/en/software)
- [Python3.8](https://www.python.org/downloads/)
- [Pip](https://pypi.org/project/pip/)

Una vez instalado, solo es necesario usar el comando (dentro de esta misma carpeta)
```
pip3 install requirements.txt
```


El codigo para la interfaz se encuentra dentro de 

```
src
```

## Ejectuar el programa 
- Para ejectuarlo, solo es necesario usar el comando (dentro de esta misma carpeta)
```
python3 main.py
```

