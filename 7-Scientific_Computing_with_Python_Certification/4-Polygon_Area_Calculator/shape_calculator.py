class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def set_width(self, width):
        self.width = width

    def set_height(self, height):
        self.height = height

    def get_area(self):
        return self.width * self.height

    def get_perimeter(self):
        return self.width*2 + self.height*2

    def get_diagonal(self):
        return (self.width ** 2 + self.height ** 2) ** .5

    def get_picture(self):
        result = ''
        # If the width or height is larger than 50 => "Too big for picture.".
        if self.width >=50 or self.height >= 50:
            return 'Too big for picture.'
        for i in range(self.height):
            result += '*' * self.width + '\n'
        return result

    def get_amount_inside(self, shape):
        wm = self.width // shape.width
        hm = self.height // shape.height
        return wm * hm
        
    def __str__(self):
        return f'Rectangle(width={self.width}, height={self.height})'

class Square(Rectangle):
    def __init__(self, width):
        self.width = width
        self.height = width

    def set_side(self, width):
        self.width = width
        self.height = width

    def set_width(self, width):
        self.set_side(width)

    def set_height(self, width):
        self.set_side(width)

    def __str__(self):
        return f'Square(side={self.width})'