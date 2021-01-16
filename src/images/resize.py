from PIL import Image

newWidth = 40

colors = ["red", "green", "yellow"]

def resize(path):
    img = Image.open(path)
    img = img.resize((newWidth, newWidth), Image.ANTIALIAS)
    img.save("resized" + path)

for c in colors:
    path = c + "_printer.png"
    resize(path)
    path = "color_" + c + "_printer.png"
    resize(path)
