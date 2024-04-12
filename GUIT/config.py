import os    
import re    
import io    
import csv
import img2pdf
import tempfile
import pandas as pd    
from datetime import datetime   
from flask import Flask, jsonify, render_template, request, Response, stream_with_context
from PIL import Image, ImageDraw, ImageFont
from deskplates_config import (    
    sku_to_image as deskplates_sku_to_image,    
    sku_to_font as deskplates_sku_to_font,    
    sku_to_fontsize_placement as deskplates_sku_to_fontsize_placement,    
    sku_to_second_fontsize_placement as deskplates_sku_to_second_fontsize_placement,    
    sku_to_second_line_font as deskplates_sku_to_second_line_font,    
    get_font_color_for_dswclr001,    
)
from neckless_config import (  
    sku_to_image as nck_sku_to_image,    
    sku_to_fontsize_placement as nck_sku_to_fontsize_placement,
    design_to_font, design_to_sku_to_second_fontsize_placement, design_to_sku_to_third_fontsize_placement, design_to_sku_to_fourth_fontsize_placement,   
) 
from ring_config import (     
    sku_to_font as rng_sku_to_font,    
    sku_to_fontsize_placement as rng_sku_to_fontsize_placement,    
    sku_to_second_fontsize_placement as rng_sku_to_second_fontsize_placement,    
    sku_to_second_line_font as rng_sku_to_second_line_font,   
    rng_sku_needs_white_background, rng_sku_to_image_one_line, rng_sku_to_image_two_line, 
    handle_rng_skus, draw_white_background_if_needed,
)    

# Merge dictionaries    
sku_to_image = {**deskplates_sku_to_image, **nck_sku_to_image}    
sku_to_font = {**deskplates_sku_to_font, **rng_sku_to_font}    
sku_to_fontsize_placement = {**deskplates_sku_to_fontsize_placement, **nck_sku_to_fontsize_placement, **rng_sku_to_fontsize_placement}    
sku_to_second_fontsize_placement = {**deskplates_sku_to_second_fontsize_placement, **rng_sku_to_second_fontsize_placement}
sku_to_second_line_font = {**deskplates_sku_to_second_line_font, **rng_sku_to_second_line_font}  
  
csv_load_count = 0  

# error skus     
def create_check_csv_image(row, load_font):
    IDAutomationHC39M_font_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'fonts', 'IDAutomationHC39M.ttf')   
    image = Image.new('RGB', (1000, 1000), color='white')  
    draw = ImageDraw.Draw(image)  
  
    # Text font  
    text_font = load_font('arial.ttf', 70)  
    text = "UNKNOWN ORDER"  
    left, _, right, _ = text_font.getbbox(text)  
    text_width = right - left  
    text_x = (1050 - text_width) // 2  
    text_y = (850 - 200) // 2  
    draw.text((text_x, text_y), text, fill=(0, 0, 0), font=text_font)  
  
    # Barcode font  
    barcode_font_size = 50  # font size  
    barcode_font = load_font(IDAutomationHC39M_font_path, barcode_font_size)  
    order_number = "*" + str(row['Order - Number']).strip('"') + "*"  
    barcode_font_color = (0, 0, 0)  # font color (black)  
    draw.text((225, 550), order_number, fill=barcode_font_color, font=barcode_font)  # position  
  
    return image     

# name the saved png
def save_image_with_subfolders(clean_sku, sku, order_number, index, qty_index, item_options, folder_name, image):

    def generate_file_name(order_number, sku, index, qty_index, tumbler_color_text=None):  
        if tumbler_color_text and tumbler_color_text != "unknown_color":          
            return f"{order_number}_{sku}_{tumbler_color_text}_{index}_{qty_index + 1}.png"          
        else:          
            return f"{order_number}_{sku}_{index}_{qty_index + 1}.png"      
        
    tumbler_color_match = re.search(        
        r'(?:Tumbler )?Color(?:s)?: ([^,]+)', str(item_options))        
    tumbler_color_text = tumbler_color_match.group(1).replace(" ", "_") if tumbler_color_match else "unknown_color"     

    image_name = generate_file_name(order_number, sku, tumbler_color_text, index, qty_index)

    # create separate folders  
    if clean_sku.startswith("RNG"):  
        sub_folder_name = 'RNG'
    elif clean_sku.startswith("NCK02"):  
        sub_folder_name = 'NCK02'  
    elif clean_sku.startswith("NCK03"):
        sub_folder_name = 'NCK03'  
    elif clean_sku.startswith("NCK04"):  
        sub_folder_name = 'NCK04' 
    else:  
        sub_folder_name = ''  

    if sub_folder_name:  
        sub_folder_path = os.path.join(folder_name, sub_folder_name)  
        if not os.path.exists(os.path.join(os.path.expanduser('~\\Downloads'), sub_folder_path)):  
            os.makedirs(os.path.join(os.path.expanduser('~\\Downloads'), sub_folder_path))  
        image_path = os.path.join(os.path.expanduser('~\\Downloads'), sub_folder_path, image_name)
        print(f"{sku} saved as {image_name}")  
    else:  
        image_path = os.path.join(os.path.expanduser('~\\Downloads'), folder_name, image_name)  

    image.save(image_path)

# for skus without personalization
def save_image_without_options(sku, clean_sku, order_number, index, qty_index, background_image_path, folder_name):  
    if clean_sku not in sku_to_font:  
        image_name = f"{order_number}_{sku}_{index}_{qty_index + 1}.png"   
        sub_folder_name = 'Stable'  
  
        sub_folder_path = os.path.join(folder_name, sub_folder_name)  
        if not os.path.exists(os.path.join(os.path.expanduser('~\\Downloads'), sub_folder_path)):  
            os.makedirs(os.path.join(os.path.expanduser('~\\Downloads'), sub_folder_path))  
        image_path = os.path.join(os.path.expanduser('~\\Downloads'), sub_folder_path, image_name)  
  
        if background_image_path is None:  
            print(f"Error: Background image not found for {sku}")  
            image = create_check_csv_image()  
        else:  
            image = Image.open(background_image_path)  
        image.save(image_path)  
        return True  
    return False  
 
# force font color   
def process_font_color(font_color, clean_sku, line_index):
    # line 1 = pink
    if (clean_sku == "JMUG11WBUVPPSNNCMUVP") and line_index == 0:   
        return (252, 192, 197)
    # line 1 = grey    
    elif (clean_sku == "JMUG11WBUVPPSLNTBBUVP" or clean_sku == "JMUG11WBUVPPSICG1UVP") and line_index == 0:   
        return (166, 166, 166) 
    elif (clean_sku == "JMUG11WBUVPPSPFCMUVP"):   
        return (223, 4, 4) 
    # black
    if clean_sku.startswith("JMUG11WB") or clean_sku in [  
                # golfballs
                "UVPCCGNHBTUVP",
                # planks  
                 "UVPCCGFSSMUVP", "UVPJMBNSSUVP", "UVPJMASSSUVP", "UVPJMBTSSUVP",                      
                # tumblers  
                 "UVPPSNUBRBUVP", "UVPPSTTPTBUVP", "UVPPSTTPTABUVP", "UVPPSTTOTBUVP",   
                 "UVPPSTTOTABUVP", "UVPPSSLPTBUVP", "UVPPSOPTTBUVP", "UVPPSVETTBUVP",
                 "UVPJMHDBSUVP",
                 ]:    
        font_color = (0, 0, 0)    
    return font_color  

def process_special_rules(clean_sku, line, line_index):  
    # replace between spaces
    if clean_sku in ["UVPCCGTUMBUVP", "UVPCCGTUMWUVP", "UVPJMMAMATBUVP", "UVPJMMAMATWUVP", "UVPPSAUNTTBUVP", "UVPPSAUNTTWUVP", "UVPJMMNSUVP"] and line_index == 1:  # line 2 edit  
        line = re.sub(r'[ ,]+', '_', line)      
    if clean_sku in ["UVPJMMNSUVP"] and line_index == 0:  # line 1 edit  
        line = re.sub(r'[ ,]+', ' * ', line) 
    if clean_sku in ["UVPPSGKNTPUVP", "UVPPSGKNTSUVP"] and line_index == 1:  # line 2 edit  
        line = re.sub(r'[ ,]+', '-*-', line)  
    # replace end spaces  
    if clean_sku in ["UVPPSTTUMBUVP", "UVPPSTTUMWUVP"]:  
        processed_line = f"[_{line}_]"  
    elif clean_sku in ["UVPPSSTILGBHUVP", "UVPPSSTILGWHUVP"]:  
        processed_line = f"{line}_"  
    elif clean_sku in ["UVPJMSLCLBUVP", "UVPJMSLCLWUVP"]:  
        processed_line = f"({line})"
    elif clean_sku in ["UVPCCGTUMBUVP", "UVPCCGTUMWUVP", "UVPJMMAMATBUVP", "UVPJMMAMATWUVP", "UVPPSAUNTTBUVP", "UVPPSAUNTTWUVP"] and line_index == 1:  # line 2 edit  
        processed_line = f"[_{line}_]"
    else:  
        processed_line = line 
    if clean_sku in["JMUG11WBUVPJMFMEMUVP"]:
        processed_line = f"{line}+"
    if clean_sku in["UVPCCGNHBTUVP"]: 
        processed_line = f"{line} did."
    if clean_sku in["JMUG11WBUVPPSPFCMUVP"]: 
        processed_line = f"(...It’s {line})"
  
    return processed_line  

# color hexs
color_name_to_rgb = {  
    'blank': (0, 0, 0),
    'black': (0, 0, 0),    
    'white': (255, 255, 255),
    'coral': (255, 65, 103), 
    'purple': (128, 0, 128),
    'rose gold': (183, 110, 121),
    'teal': (0, 128, 128),
    'blush': (255, 192, 203),
    'lilac': (154, 113, 157),
    'maroon': (73, 5, 5),
    'baby blue': (163, 208, 230),
    'royal blue': (53, 82, 200),
    'navy': (50, 59, 96),
    'iceburg': (203, 217, 222),
    'seascape': (190, 233, 229),
    'gold': (255, 174, 51),
    'orange': (255, 145, 75),
    'yellow': (255, 211, 89),
    'gray': (166, 166, 166),
    'mint': (103, 230, 201),
    'baby pink': (254, 189, 198),
    'hot pink': (255, 102, 196),
    'pink': (255, 148, 202),  
     
}

# hard set the font color
def get_processed_font_color(clean_sku, item_options, color_name_to_rgb, get_font_color_for_dswclr001, process_font_color):
    if clean_sku.startswith(("RNG", "NCK", "SRN", "GLS")):
        font_color = (0, 0, 0)
    elif not clean_sku.startswith("DSWCLR001"):
        design_color_match = re.search(
            r'(?:Color of Text|Design Option & Color|Font Color|Wording Color|Design(?: Colors?)?|Custom Text Color):\s*([\w\s]+)',
            item_options)
        if design_color_match:
            design_color_text = design_color_match.group(1).lower()
        else:
            design_color_text = "white"
        font_color = color_name_to_rgb.get(design_color_text, (255, 255, 255))
    else:
        font_color = get_font_color_for_dswclr001(clean_sku)

    processed_font_color = process_font_color(font_color, clean_sku, line_index=0)
    return processed_font_color


# unicodes 
font_to_uni = {  
    "a": "0A01",  
    "b": "0A02",  
    "c": "0A03",  
    "d": "0A04",  
    "e": "0A05",  
    "f": "0A06",

    "g": "0B07",  
    "h": "0B08",  
    "i": "0B09",  
    "j": "0B10",  
    "k": "0B11",  
    "l": "0B12",

    "m": "0C13",  
    "n": "0C14",  
    "o": "0C15",  
    "p": "0C16",  
    "q": "0C17",  
    "r": "0C18",

    "s": "0D19",  
    "t": "0D20",  
    "u": "0D21",  
    "v": "0D22",  
    "w": "0D23",  
    "x": "0D24",

    "y": "0E25",  
    "z": "0E26",  
}

def handle_unicode_characters(clean_sku, processed_line, line_index, font_to_uni):
    # unicoded last letter  
    prefixes = ["NCKGLD", "NCKSIL", "NCKRSG", "NCK02GLD", "NCK02SIL", "NCK02RSG", "NCK03GLD", "NCK03SIL", "NCK03RSG", "NCK04GLD", "NCK04SIL", "NCK04RSG"]  
    if any(clean_sku.startswith(prefix) for prefix in prefixes) or (clean_sku.startswith("RNG") and line_index == 1):  
        last_char = processed_line[-1].lower()  
        unicode_code = font_to_uni.get(last_char)  
        if unicode_code:  
            processed_line = processed_line[:-1] + chr(int(unicode_code, 16))  
        else:  
            print(f"Warning: Unicode character not found for '{last_char}'.")  

    # unicoded first letter  
    month_codes = {  
        "NCKJAN": "1A01",  
        "NCKFEB": "1A02",  
        "NCKMAR": "1A03",  
        "NCKAPR": "1A04",  
        "NCKMAY": "1A05",  
        "NCKJUN": "1A06",  
        "NCKJUL": "1A07",  
        "NCKAUG": "1A08",  
        "NCKSEP": "1A09",  
        "NCKOCT": "1A10",  
        "NCKNOV": "1A11",  
        "NCKDEC": "1A12",  
    }  

    for month, code in month_codes.items():    
        if clean_sku.startswith(month):    
            first_char = processed_line[0]    
            unicode_code = font_to_uni.get(first_char.lower())    
            if unicode_code:    
                processed_line = chr(int(code, 16)) + first_char + processed_line[1:]    
            else:    
                print(f"Warning: Unicode character not found for '{first_char}'.")    
            break

    return processed_line
