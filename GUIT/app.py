
import requests
from config import *
from config import get_processed_font_color
from PIL import Image, ImageDraw, ImageFont 

def process_personalization_text(text, clean_sku):      
    lines = [line for line in text.split('\n') if line.strip()]      
    lines = [re.sub(r'(line \d+: ?|name[s]?: ?|title[s]?: ?|top name[s]?: ?|bottom name[s]?: ?|kids name[s]?: ?)', '', line, flags=re.IGNORECASE).strip('\r') for line in lines]      
    lines = [line for line in lines if line.strip()]      
      
    processed_lines = []      
    for line_index, line in enumerate(lines):      
        line = re.sub(r',$', '', line)  # remove comma at the end of the line     
      
        processed_line = process_special_rules(clean_sku, line, line_index)  
  
        # remove  
        processed_line = re.sub(r',\s*chain:\s*Box Chain', '', processed_line)   
        processed_line = re.sub(r',\s*font:\s*Claster Regular', '', processed_line)   
   
    # unicode
        processed_line = handle_unicode_characters(clean_sku, line, line_index, font_to_uni)  
        processed_lines.append(processed_line)  
  
    return '\n'.join(processed_lines) 
    
# Load font from the given font path and font size    
def load_font(font_path, font_size):    
    try:    
        font = ImageFont.truetype(font_path, font_size)    
    except OSError:    
        print(f"Error loading font: {font_path}. Using default font.")    
        font = ImageFont.load_default()    
    return font    
    
def get_font_path(clean_sku):    
    font_path = sku_to_font.get(clean_sku, 'arial.ttf')    
    return font_path    

# line placement 
def calculate_font_size_and_placement(sku, text, num_chars, item_options):      
    max_x = sku_to_fontsize_placement.get(sku, {}).get("max_x", 3700)
      
    if sku.startswith("NCK"):    
        design_font_match = re.search(r'Design:\s*([\w\s-]+)', item_options)    
        if design_font_match:    
            design_font = design_font_match.group(1)    
            if design_font in design_to_font:    
                values = sku_to_fontsize_placement.get(design_font, {}).get(num_chars, (200, None, 100))    
            else:    
                values = sku_to_fontsize_placement.get(sku, {}).get(num_chars, (200, None, 100))    
        else:    
            values = sku_to_fontsize_placement.get(sku, {}).get(num_chars, (200, None, 100))    
    elif sku.startswith("RNG"):    
        font_size, x, y = sku_to_fontsize_placement.get(sku, {}).get(num_chars, (200, None, 100))    
        font = load_font(get_font_path(sku), font_size)    
        left, _, right, _ = font.getbbox(text)    
        text_width = right - left    
        x = max_x - text_width    
        return font_size, x, y    
    else:    
        values = sku_to_fontsize_placement.get(sku, {}).get(num_chars, (200, None, 100))    
      
    if len(values) == 2:      
        font_size, y = values      
        x = None      
    else:      
        font_size, x, y = values      
    print(f"1st Num chars: {num_chars}")      
    return font_size, x, y  

# line 2    
def calculate_second_font_size_and_placement(sku, num_chars, item_options):      
    if sku.startswith("NCK"):  
        design_font_match = re.search(r'Design:\s*([\w\s-]+)', item_options)  
        if design_font_match:  
            design_font = design_font_match.group(1)  
            if design_font in design_to_sku_to_second_fontsize_placement:  
                font_size, x, y = design_to_sku_to_second_fontsize_placement[design_font]  
            else:   
                font_size, x, y = get_font_size_placement_from_sku(sku, num_chars)  
        else:  
            font_size, x, y = get_font_size_placement_from_sku(sku, num_chars)  
    else:  
        font_size, x, y = get_font_size_placement_from_sku(sku, num_chars)  
    print(f"2nd Num chars: {num_chars}")
    return font_size, x, y

# line 3  
def calculate_third_font_size_and_placement(sku, num_chars, item_options):     
    if sku.startswith("NCK"):  
        design_font_match = re.search(r'Design:\s*([\w\s-]+)', item_options)  
        if design_font_match:  
            design_font = design_font_match.group(1)  
            if design_font in design_to_sku_to_third_fontsize_placement:  
                values = design_to_sku_to_third_fontsize_placement[design_font]
    if len(values) == 2:  
        font_size, y = values  
        x = None  
    else:  
        font_size, x, y = values  
    print(f"3rd Num chars: {num_chars}")
    return font_size, x, y

# line 4  
def calculate_fourth_font_size_and_placement(sku, num_chars, item_options):        
    if sku.startswith("NCK"):    
        design_font_match = re.search(r'Design:\s*([\w\s-]+)', item_options)    
        if design_font_match:    
            design_font = design_font_match.group(1)    
            if design_font in design_to_sku_to_fourth_fontsize_placement:    
                font_size, x, y = design_to_sku_to_fourth_fontsize_placement[design_font]
    return font_size, x, y  


def get_font_size_placement_from_sku(sku, num_chars):  
    sku_fontsize_placement = sku_to_second_fontsize_placement.get(sku, {})      
    values = sku_fontsize_placement.get(num_chars, (200, None, 100))      
    if len(values) == 2:      
        font_size, y = values      
        x = None      
    else:      
        font_size, x, y = values  
      
    return font_size, x, y   
    
# white background for RNG   
def draw_white_background(draw, x, y, text_width, text_height, is_first_line=False):  
    if is_first_line:  
        margin_left = 10  
        margin_right = 100
    else:  
        margin_left = 10  
        margin_right = -80  
  
    draw.rectangle([x + margin_left, y, x + text_width + margin_right, y + text_height], fill=(255, 255, 255))   

def read_vfm_kerning(vfm_path):    
    kerning_table = {}    
        
    def parse_inner_dict(inner_dict_str):    
        inner_dict = {}    
        inner_pairs = re.findall(r'"(\w+)": "(-?\d+)"', inner_dict_str)
        for key, value in inner_pairs:    
            inner_dict[key] = int(value)    
        return inner_dict    
    
    with open(vfm_path, "r") as vfm_file:    
        content = vfm_file.read()    
        outer_pairs = re.findall(r'"(\w)": {(.*?)}', content, re.DOTALL)    
            
        for left, inner_dict_str in outer_pairs:    
            inner_dict = parse_inner_dict(inner_dict_str)    
            for right, value in inner_dict.items():    
                pair = (left, right)    
                kerning_table[pair] = float(value)    
    return kerning_table

def apply_kerning(text, kerning_table, scale_factor=1):    
    kerned_text = []    
    for i in range(len(text) - 1):    
        left_char = text[i]  
        right_char = text[i + 1]  
        # Handle Unicode characters  
        if is_unicode_character(left_char):  
            left_char = f"uni{ord(left_char):04X}"  
        if is_unicode_character(right_char):  
            right_char = f"uni{ord(right_char):04X}"  
          
        pair = (left_char, right_char)  
        kern_value = kerning_table.get(pair, 0) * scale_factor      
        kerned_text.append((text[i], kern_value))    
    kerned_text.append((text[-1], 0))    
    return kerned_text  

def get_vfm_path(clean_sku, item_options):
    font_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'fonts_JEW')
    
    design_font_match = re.search(r'Design:\s*([\w\s-]+)', item_options)
    if design_font_match:
        design_font = design_font_match.group(1)
        if design_font in design_to_font:
            font_filename = design_to_font[design_font].split('/')[-1].replace('.ttf', '.vfm')
        else:
            font_filename = 'default.vfm'
    else:
        font_filename = 'default.vfm'
    
    return os.path.join(font_directory, font_filename)

def is_unicode_character(char):  
    return ord(char) > 127  
  
def draw_text_with_kerning(draw, x, y, kerned_text, fill, font):    
    x_offset = 0    
    for char, kerning in kerned_text:
    
        draw.text((x + x_offset, y), char, fill=fill, font=font)    
        x_offset += font.getlength(char) + kerning

# Process each row from the dataframe    
def process_row(index, row, folder_name, sku, clean_sku, qty_index, load_font):  
    # extract clean SKU and background image path from the row 
    print(f"Processing row: {index}, clean_sku: {clean_sku}")  
    sku = row['Item - SKU']
    order_number = str(row['Order - Number']).strip('"')    
    item_options = str(row['Item - Options']) 

    if clean_sku.startswith("CLABEL"):    
            art_location_match = re.search(r'print_url(?:_1)?:\s*(https://[\w\./?=-]+(?:[\w\./?=&-]+)?)', item_options)   
            if art_location_match:    
                art_location_url = art_location_match.group(1)    
                response = requests.get(art_location_url)    
        
                if response.status_code == 200:    
                    # Save the .png file    
                    png_name = f"{order_number}_{index}.png"    
                    png_path = os.path.join(folder_name, png_name)    
                    with open(png_path, 'wb') as f:    
                        f.write(response.content)    
                    print(f"Saved PNG from print_url: {png_path}")    
    
                    # Multiply the image size by 0.15982  
                    image = Image.open(png_path)  
                    width, height = image.size  
                    new_width = int(width * 0.15982)  
                    new_height = int(height * 0.15982)  
                    resized_image = image.resize((new_width, new_height))  
                    resized_image.save(png_path)  
                    print(f"Resized PNG: {png_path}")  
    
                else:    
                    print(f"Error downloading PNG from print_url: {art_location_url}")    
            else:    
                print(f"print_url not found in Item - Options: {item_options}")
 
    clean_sku_match = re.search(r"(?:DSWCLR001)?UVP[A-Z0-9]+|JMUG11WB[A-Z0-9]+", sku)       
    if not clean_sku_match:        
        clean_sku_match = re.search(r"RNG[A-Z0-9]+", sku)  
    if not clean_sku_match:        
        clean_sku_match = re.search(r"SRN[A-Z0-9]+", sku)
    if not clean_sku_match:      
        clean_sku_match = re.search(r"GLS[A-Z0-9]+", sku)      
    if not clean_sku_match:          
        clean_sku_match = re.search(r"NCK[A-Z0-9]+", sku)
    if not clean_sku_match:        
        return  

    if not clean_sku_match:    
        return    
    clean_sku = clean_sku_match.group(0) 
    background_image_path = sku_to_image.get(clean_sku)
    font_path = get_font_path(clean_sku)

    print(f"Background image path: {background_image_path}")  

    # skus without personalization_text  
    personalization_text = row['Item - Options']    
        
    if not personalization_text or not str(personalization_text).strip():    
        is_saved = save_image_without_options(sku, clean_sku, order_number, index, qty_index, background_image_path, folder_name, row, load_font)    
        if is_saved:    
            print(f"{sku} saved as {image_name if 'image_name' in locals() else 'unknown_image_name'}")   
        else:    
            print(f"Error saving {sku}")    
        return
    
    inscriptions_match = re.findall(r'(?:Left|Right) Inscription:\s*([\s\S]+?)(?:,|$)', str(item_options))  
    
    if inscriptions_match:  
        personalization_text = '\n'.join(inscriptions_match).strip()  
    else:  
        match = re.search(r'(?:Personalization|Custom Name):([\s\S]+)', str(item_options))  
        if match:  
            personalization_text = match.group(1)  
        else:  
            personalization_text = ''  
    
    
    lines = [line for line in personalization_text.split('\n') if line.strip()]    
    lines = [re.sub(r'Line \d+: ?', '', line).strip('\r') for line in lines]    
    lines = [line.strip() for line in lines if line.strip()] 


 # Apply kerning if clean_sku starts with NCK
    print(f"clean_sku in process_row: {clean_sku}")

    if clean_sku.startswith("NCK"):  
        vfm_path = get_vfm_path(clean_sku, item_options)
        kerning_table = read_vfm_kerning(vfm_path)  
        scale_factor = .5  # You can adjust this value as needed  
        for i, line in enumerate(lines):   
            lines[i] = apply_kerning(line, kerning_table, scale_factor)     

    # ERROR does not reconize sku or the lines in sku   
    if not lines:    
        image = create_check_csv_image(row, load_font)    
        image_name = f"{order_number}_{sku}_{index}.png"    
        image_path = os.path.join(os.path.expanduser('~\\Downloads'), image_name)    
        image.save(image_path)    
        print(f"Error: list index out of range, saved {order_number}_{sku}_{index}.png")    
        return    
    else:    
        num_chars_line1 = len(lines[0])

    # handle RNG skus
    background_image_path = handle_rng_skus(clean_sku, lines, rng_sku_to_image_one_line, rng_sku_to_image_two_line, background_image_path)
 

    # Apply special rules to split sku for different design options
    design_option_match = re.search(r'Design Options:\s*([\w\s-]+)', str(row['Item - Options']))  
    if design_option_match:  
        design_option = design_option_match.group(1).upper().replace(" ", "_")  
        if clean_sku in ('UVPPSBASTUVP', 'UVPPSCFDNPUVP'):  
            background_image_path = sku_to_image.get(f'{clean_sku}-{design_option}') 


    # Apply special rules to personalization text and font color    
    processed_text = process_personalization_text(personalization_text, clean_sku)    
    lines = [line for line in processed_text.split('\n') if line.strip()]    
    print(f"Lines: {lines}")

    num_chars_line1 = len(lines[0])    
    font_size_line1, x_line1, y_line1 = calculate_font_size_and_placement(clean_sku, lines[0], num_chars_line1, item_options)  
    
    if len(lines) > 1:    
        num_chars_line2 = len(lines[1])    
        font_size_line2, x_line2, y_line2 = calculate_second_font_size_and_placement(clean_sku, num_chars_line2, item_options) 
    else:    
        font_size_line2, x_line2, y_line2 = None, None, None 

    if len(lines) > 2:  
        num_chars_line3 = len(lines[2])  
        font_size_line3, x_line3, y_line3 = calculate_third_font_size_and_placement(clean_sku, num_chars_line3, item_options) 
    
    if len(lines) > 3:  
        num_chars_line4 = len(lines[3])  
        font_size_line4, x_line4, y_line4 = calculate_fourth_font_size_and_placement(clean_sku, num_chars_line4, item_options)  
            
    # Create image with personalized text    
    image = Image.open(background_image_path) if background_image_path else Image.new('RGB', (3250, 1750), color='white')    
    draw = ImageDraw.Draw(image)    
    image_width, _ = image.size    
    
    # hard set the font color
    font_color = get_processed_font_color(clean_sku, item_options, color_name_to_rgb, get_font_color_for_dswclr001, process_font_color)

    # Draw each line separately 
    kerned_lines = [apply_kerning(line, kerning_table, scale_factor) for line in lines] if clean_sku.startswith("NCK") else lines
   
    # Draw each line separately      
    for i, line in enumerate(lines):      
        # Load the font for the current line      
        font_path = sku_to_second_line_font.get(clean_sku, font_path) if i == 1 else get_font_path(clean_sku) 
        # font_path = sku_to_third_line_font.get(clean_sku, font_path) if i == 2 else get_font_path(clean_sku) 

        # Handle NCK SKUs    
        if clean_sku.startswith("NCK"):    
            design_font_match = re.search(r'Design:\s*([\w\s-]+)', item_options)    
            if design_font_match:    
                design_font = design_font_match.group(1)    
                if design_font in design_to_font:    
                    font_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'fonts_JEW', design_to_font[design_font])    
                else:    
                    print(f"Warning: Design '{design_font}' not found in design_to_font dictionary. Using default font.")    
                    font_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'fonts_JEW', 'arial.ttf')    
    
        font_size = font_size_line1  
        if i == 1: 
            font_size = font_size_line2  
        elif i == 2:
            font_size = font_size_line3  
        elif i == 3: 
            font_size = font_size_line4  
    
        font = load_font(font_path, font_size)      
    
        text_y = y_line1  
        if i == 1: 
            text_y = y_line2  
        elif i == 2: 
            text_y = y_line3  
        elif i == 3:  
            text_y = y_line4  
    
        # center the text if x-coordinate is not provided      
        if i == 1 and x_line2 is not None:      
            text_x = x_line2      
        elif x_line1 is not None:      
            text_x = x_line1      
        else:      
            left, _, right, _ = font.getbbox(line)      
            text_width = right - left      
            text_x = (image_width - text_width) // 2      
        
        # white background behind the text if the SKU starts with "RNG"      
        draw_white_background_if_needed(clean_sku, rng_sku_needs_white_background, font, line, text_x, text_y, draw_white_background, draw, is_first_line=(i == 0))    

        # Draw the current line
        if clean_sku.startswith("NCK"):
            kerned_line = kerned_lines[i]
            draw_text_with_kerning(draw, text_x, text_y, kerned_line, font_color, font)
            print(f"Drawing line {i + 1} - Font size: {font_size}, X: {text_x}, Y: {text_y}")
        else:
            draw.text((text_x, text_y), line, fill=process_font_color(font_color, clean_sku, i), font=font) 
            print(f"Drawing line nonKern")
    
    # name the saved png
    image_result = save_image_with_subfolders(clean_sku, sku, order_number, index, qty_index, item_options, folder_name, image)  
    if image_result is not None:  
        image_path, image_name = image_result  
    # else:  
    #     print(f"Error: Image result is None for row {index}, clean_sku: {clean_sku}")  
    
    print(f"Final personalization text: {personalization_text}") 
 
# Export images from the given dataframe    
def export_images(df, full_folder_path):  
    if df.empty:    
        return {"error": "Please load a CSV file first."}    
    
    for index, row in df.iterrows():    
        if pd.isna(row['Item - SKU']):    
            continue  
        clean_sku = row['Item - SKU'].strip()
        item_qty = int(row['Item - Qty'])  
        for qty_index in range(item_qty):
            sku = row['Item - SKU'].strip()
            process_row(index, row, full_folder_path, sku, clean_sku, qty_index, load_font)   
    
    return {"message": f"Images exported to {full_folder_path}!"} 

# design window loading screen      
def processing_generator(csv_data, folder_name):        
    csv_reader = csv.DictReader(csv_data)          
    rows = [row for row in csv_reader]          
            
    df = pd.DataFrame(rows)          
          
    processed_count = 0      
          
    for index, row in df.iterrows():    
        item_qty = int(row['Item - Qty'])    
        for qty_index in range(item_qty):    
            if pd.isna(row['Item - SKU']) or row['Item - SKU'] == "":            
                continue        
      
            # Extract clean_sku from row['Item - SKU']      
            sku = row['Item - SKU'].strip()      
            clean_sku_match = re.search(r"(?:DSWCLR001)?UVP[A-Z0-9]+", sku)      
            if not clean_sku_match:      
                clean_sku_match = re.search(r"RNG[A-Z0-9]+", sku)
            if not clean_sku_match:      
                clean_sku_match = re.search(r"SRN[A-Z0-9]+", sku) 
            if not clean_sku_match:      
                clean_sku_match = re.search(r"GLS[A-Z0-9]+", sku) 
            if not clean_sku_match:      
                clean_sku_match = re.search(r"NCK[A-Z0-9]+", sku)  
            if not clean_sku_match:      
                continue      
            clean_sku = clean_sku_match.group(0)

            processed_count += 1          
            progress_message = f"Processed order {row['Order - Number']}, {row['Item - SKU']}: {index}\n"           
            yield progress_message          
          
    yield f"Processing complete. Processed {processed_count} rows."    
    
  
# Flask app setup    
app = Flask(__name__)   
    
@app.route('/')    
def home():    
    return render_template('home.html')    
    
@app.route('/precheck')    
def precheck():    
    return render_template('precheck.html')    
    
@app.route('/designer')    
def designer():    
    return render_template('designer.html')    
    
@app.route('/templatemerger')    
def templatemerger():    
    return render_template('templatemerger.html')   
  
@app.route('/run-script', methods=['POST'])    
def run_script():    
    global csv_load_count 
        
    csv_file = request.files.get('csv_file')    
    if csv_file:    
        decoded_csv = csv_file.read().decode('utf-8')    
        csv_data = io.StringIO(decoded_csv)    
        df = pd.read_csv(csv_data)    
    
        # Increment the csv_load_count    
        csv_load_count += 1    
    
        # Create the full folder path with index    
        folder_name = f"{datetime.now().strftime('%Y-%m-%d')}({csv_load_count})"    
        full_folder_path = os.path.join(os.path.expanduser('~\\Downloads'), folder_name)    
        if not os.path.exists(full_folder_path):    
            os.makedirs(full_folder_path)    
    
        result = export_images(df, full_folder_path)
        if result.get('error'):    
            return jsonify(result), 400    
   
        return Response(stream_with_context(processing_generator(io.StringIO(decoded_csv), full_folder_path)), mimetype='text/html')    
    else:    
        return jsonify({"error": "CSV file not provided"}), 400    
  
  
if __name__ == '__main__':    
    print("Running Print Layout Lab application... at http://127.0.0.1:5000")    
    app.run(debug=True)