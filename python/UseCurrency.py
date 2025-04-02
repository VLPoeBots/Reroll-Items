import pyautogui
import sys
CurrencyCoords = sys.argv[1].split(",")
ItemCoords = sys.argv[2].split(",")
CurrencyCoords = (int(CurrencyCoords[0]), int(CurrencyCoords[1]))
ItemCoords = (int(ItemCoords[0]),int(ItemCoords[1]))

print(CurrencyCoords, flush=True)
print(ItemCoords, flush=True)

def UseCurrency():
    
    pyautogui.moveTo(CurrencyCoords)
    pyautogui.rightClick()
    pyautogui.moveTo(ItemCoords)
    pyautogui.leftClick()
    
UseCurrency()